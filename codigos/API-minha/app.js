const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const usersRouter = require('./src/controllers/usersController');
const authRouter = require('./src/controllers/authController');
const transferRouter = require('./src/controllers/transferController');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API - Minha',
    version: '1.0.1',
    description: 'API para aprendizado de testes e automação - PGATS 2025'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'by Leut' }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [path.join(__dirname, 'src', 'controllers', '*.js')]
};

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc(options);
// endpoint para inspecionar o swagger.json
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rotas
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/transfers', transferRouter);

module.exports = app;