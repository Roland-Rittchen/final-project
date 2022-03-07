import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    userlevel: Int!
    password_hash: String
    session: Session
  }

  type Session {
    id: ID!
    token: String!
    expiry_timestamp: DateTime!
    user: User!
    userId: Int!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getAllUsers: [User]!
    getUserById(id: Int!): User!
    getUserBySessionToken(token: String): User!
    getUserWithPasswordHashByUsername(name: String!): User!
    getValidSessionByToken(token: String): Session!
  }

  type Mutation {
    createUser(name: String!, level: Int!, password: String!): AuthPayload
    createSession(token: String!, userId: Int!): Session!
    deleteExpiredSessions: Session!
    deleteSessionByToken(token: String): Session!
    login(email: String!, password: String!): AuthPayload
  }
`;
