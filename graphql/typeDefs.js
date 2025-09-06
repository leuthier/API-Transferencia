const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    favored: [String]
    balance: Float
  }

  type Transfer {
    id: ID!
    fromId: String!
    toId: String!
    amount: Float!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    transfers: [Transfer]
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!, favored: [String], balance: Float): User
    login(email: String!, password: String!): AuthPayload
    transfer(fromEmail: String!, toEmail: String!, amount: Float!): Transfer
  }
`;

module.exports = typeDefs;
