// src/server.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const depthLimit = require('graphql-depth-limit');
const schema = require('./schema');

const app = express();
const PORT = 4000;

// Middleware de log de auditoria básico na console
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AUDIT-LOG] Requisição recebida em: ${req.url} de ${req.ip}`);
    next();
});

// Configuração do Endpoint GraphQL protegido contra ataques de negação de serviço (DoS)
app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    graphiql: true, // Habilita a excelente interface IDE interativa GraphiQL
    // [🛡️ DEFESA DE INFRAESTRUTURA OWASP]: Impede que consultas aninhadas infinitamente travem o runtime do Node.js
    validationRules: [ depthLimit(4) ],
    customFormatErrorFn: (err) => {
        // Formata os logs de erro para auditoria interna de segurança corporativa
        console.error(`[GraphQL Error]: ${err.message}`);
        return {
            message: err.message,
            locations: err.locations,
            path: err.path,
            enterprise: "DiVinti Tech Gateway Protection v1.0.0"
        };
    }
})));

app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 DiVinti Nexus Gateway operacional na porta: ${PORT}`);
    console.log(`🛡️  Mecanismo Anti-DoS (Depth Limiter) ativo: Máx. 4 Níveis`);
    console.log(`📊 Acesse o painel de testes em: http://localhost:${PORT}/graphql`);
    console.log(`=============================================================\n`);
});
