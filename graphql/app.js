const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authenticateJWT } = require('./auth');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = authenticateJWT(req);
    return { user };
  }
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app });
}
startApollo();

module.exports = app;
