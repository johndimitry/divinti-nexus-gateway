// src/data.js

const events = [
    { id: 'ev-101', name: 'DiVinti CyberSec Summit 2026', date: '2026-11-15', speakerIds: ['sp-1', 'sp-2'], locationId: 'loc-1', sponsorIds: ['spon-1', 'spon-3'] },
    { id: 'ev-102', name: 'Cloud Native & AI Architecture Day', date: '2026-12-05', speakerIds: ['sp-3', 'sp-4'], locationId: 'loc-2', sponsorIds: ['spon-2', 'spon-4'] },
    { id: 'ev-103', name: 'Enterprise DevSecOps Forum', date: '2027-01-20', speakerIds: ['sp-1', 'sp-4'], locationId: 'loc-1', sponsorIds: ['spon-1', 'spon-4', 'spon-5'] }
];

const speakers = [
    { id: 'sp-1', name: 'Alice Santos', company: 'CrowdStrike', expertise: 'Threat Intelligence & Incident Response' },
    { id: 'sp-2', name: 'Carlos Silva', company: 'Cloudflare', expertise: 'Zero Trust Architecture & Edge Security' },
    { id: 'sp-3', name: 'Mariana Costa', company: 'Google Cloud', expertise: 'Machine Learning Pipelines & Big Data' },
    { id: 'sp-4', name: 'John Dimitry', company: 'DiVinti Enterprise', expertise: 'Secure Application Design & Backend Engineering' }
];

const locations = [
    { id: 'loc-1', name: 'Auditório Alpha Corporate', city: 'São Paulo', capacity: 450 },
    { id: 'loc-2', name: 'Centro de Convenções Tech Hub', city: 'Rio de Janeiro', capacity: 1200 }
];

const sponsors = [
    { id: 'spon-1', name: 'AWS', tier: 'DIAMOND', industry: 'Cloud Computing' },
    { id: 'spon-2', name: 'OpenAI', tier: 'PLATINUM', industry: 'Artificial Intelligence' },
    { id: 'spon-3', name: 'Stripe', tier: 'GOLD', industry: 'Fintech & Payments' },
    { id: 'spon-4', name: 'Microsoft Azure', tier: 'DIAMOND', industry: 'Cloud Infrastructure' },
    { id: 'spon-5', name: 'HashiCorp', tier: 'SILVER', industry: 'DevOps Tools' }
];

const tickets = [
    { id: 'tk-1', eventId: 'ev-101', type: 'General Admission', price: 299.90, availability: 150 },
    { id: 'tk-2', eventId: 'ev-101', type: 'VIP Backstage Pass', price: 899.00, availability: 30 },
    { id: 'tk-3', eventId: 'ev-102', type: 'Standard Pass', price: 199.00, availability: 400 },
    { id: 'tk-4', eventId: 'ev-102', type: 'Premium Keynote Access', price: 499.00, availability: 100 },
    { id: 'tk-5', eventId: 'ev-103', type: 'Full Conference Access', price: 350.00, availability: 200 }
];

module.exports = { events, speakers, locations, sponsors, tickets };
