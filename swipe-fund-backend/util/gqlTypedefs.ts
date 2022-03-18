import { gql } from 'apollo-server';

export type User = {
  id: number;
  username: String;
  userlevel: number;
  password_hash: String;
  sessionId: number;
};

export type Session = {
  id: number;
  token: String;
  expiry_timestamp: string;
  userId: number;
};

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    userlevel: Int!
    password_hash: String
    sessionId: Int
  }

  type Session {
    id: ID!
    token: String!
    expiry_timestamp: DateTime!
    userId: Int!
  }

  type Success {
    success: Boolean
  }

  type AuthPayload {
    user: User
    error: String
  }

  type Query {
    getAllUsers: [User]!
    getAllSessions: [Session]!
    getUserById(id: Int!): User!
    getUserByUsername(name: String): User!
    getUserBySessionToken: User
    getUserWithPasswordHashByUsername(name: String!): User!
    getValidSessionByToken: Session!
  }

  type Mutation {
    createUser(name: String!, level: Int!, password: String!): AuthPayload
    createSession(token: String!, userId: Int!): Session!
    deleteExpiredSessions: Session!
    deleteSessionByToken: Success
    logUserIn(email: String!, password: String!): AuthPayload
    deleteUser(id: Int!): User
  }
`;
