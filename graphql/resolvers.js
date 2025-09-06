const userService = require('../src/services/userService');
const transferService = require('../src/services/transferService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'top-secret';

module.exports = {
  Query: {
    users: () => userService.listUsers(),
    transfers: () => transferService.listTransfers ? transferService.listTransfers() : [],
  },
  Mutation: {
    registerUser: (_, args) => userService.registerUser(args),
    login: (_, { email, password }) => {
      const result = userService.authenticate({ email, password });
      return { token: result.token, user: result.user };
    },
    transfer: (_, { fromEmail, toEmail, amount }, context) => {
      if (!context.user) throw new Error('Autenticação obrigatória');
      if (fromEmail !== context.user.email) throw new Error('Você só pode transferir valores da sua própria conta');
      return transferService.transfer({ fromEmail, toEmail, amount });
    },
  },
};
