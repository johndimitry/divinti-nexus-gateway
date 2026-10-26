// src/schema.js
const { 
    GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, 
    GraphQLList, GraphQLSchema, GraphQLID, GraphQLNonNull 
} = require('graphql');

// Importação da nossa massa de dados corporativa
const { events, speakers, locations, sponsors, tickets } = require('./data');

// --- DEFINIÇÃO DOS TIPOS DE GRAFOS ---

// Tipo Palestrante (Speaker)
const SpeakerType = new GraphQLObjectType({
    name: 'Speaker',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        company: { type: GraphQLString },
        expertise: { type: GraphQLString },
        // Relacionamento Reverso: Descobrir em quais eventos este palestrante vai atuar
        events: {
            type: new GraphQLList(EventType),
            resolve(parent) {
                return events.filter(event => event.speakerIds.includes(parent.id));
            }
        }
    })
});

// Tipo Patrocinador (Sponsor)
const SponsorType = new GraphQLObjectType({
    name: 'Sponsor',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        tier: { type: GraphQLString }, // DIAMOND, PLATINUM, GOLD
        industry: { type: GraphQLString },
        events: {
            type: new GraphQLList(EventType),
            resolve(parent) {
                return events.filter(event => event.sponsorIds.includes(parent.id));
            }
        }
    })
});

// Tipo Ingresso (Ticket)
const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLFloat },
        availability: { type: GraphQLInt },
        event: {
            type: EventType,
            resolve(parent) {
                return events.find(event => event.id === parent.eventId);
            }
        }
    })
});

// Tipo Local (Location)
const LocationType = new GraphQLObjectType({
    name: 'Location',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        capacity: { type: GraphQLInt },
        events: {
            type: new GraphQLList(EventType),
            resolve(parent) {
                return events.filter(event => event.locationId === parent.id);
            }
        }
    })
});

// Tipo Principal: Evento (Event)
const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        location: {
            type: LocationType,
            resolve(parent) {
                return locations.find(loc => loc.id === parent.locationId);
            }
        },
        speakers: {
            type: new GraphQLList(SpeakerType),
            resolve(parent) {
                return speakers.filter(sp => parent.speakerIds.includes(sp.id));
            }
        },
        sponsors: {
            type: new GraphQLList(SponsorType),
            resolve(parent) {
                return sponsors.filter(spon => parent.sponsorIds && parent.sponsorIds.includes(spon.id));
            }
        },
        tickets: {
            type: new GraphQLList(TicketType),
            resolve(parent) {
                return tickets.filter(t => t.eventId === parent.id);
            }
        }
    })
});

// --- ROOT QUERY (Consultas Avançadas com Filtros) ---
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event: {
            type: EventType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return events.find(e => e.id === args.id);
            }
        },
        events: {
            type: new GraphQLList(EventType),
            resolve() {
                return events;
            }
        },
        speakers: {
            type: new GraphQLList(SpeakerType),
            args: { searchCompany: { type: GraphQLString } },
            resolve(parent, args) {
                if (args.searchCompany) {
                    return speakers.filter(sp => sp.company.toLowerCase().includes(args.searchCompany.toLowerCase()));
                }
                return speakers;
            }
        },
        locations: {
            type: new GraphQLList(LocationType),
            resolve() { return locations; }
        }
    }
});

// --- MUTATIONS (Gravação e Validação de Estado Seguro) ---
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createEvent: {
            type: EventType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                date: { type: new GraphQLNonNull(GraphQLString) },
                locationId: { type: new GraphQLNonNull(GraphQLID) },
                speakerIds: { type: new GraphQLList(GraphQLID) },
                sponsorIds: { type: new GraphQLList(GraphQLID) }
            },
            resolve(parent, args) {
                // [🛡️ REGRA DE SEGURANÇA / INTEGRIDADE]: Validar se a localização existe
                const targetLocation = locations.find(loc => loc.id === args.locationId);
                if (!targetLocation) {
                    throw new Error(`[DiVinti Security Exception]: Falha na integridade dos dados. O locationId '${args.locationId}' fornecido não existe.`);
                }

                const newEvent = {
                    id: `ev-${events.length + 101}`,
                    name: args.name,
                    date: args.date,
                    locationId: args.locationId,
                    speakerIds: args.speakerIds || [],
                    sponsorIds: args.sponsorIds || []
                };
                events.push(newEvent);
                return newEvent;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
