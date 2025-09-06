const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    favored: [String]
    balance: Float
  }

  type Transfer {
    id: ID!
    from: User!
    to: User!
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
