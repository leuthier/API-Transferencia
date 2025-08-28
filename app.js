const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const usersRouter = require('./src/controllers/usersController');
const authRouter = require('./src/controllers/authController');
const transferRouter = require('./src/controllers/transferController');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rotas
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/transfers', transferRouter);

module.exports = app;