import { gql } from 'apollo-server';

export type User = {
  id: number;
  username: String;
  userlevel: number;
  password_hash: String;
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
    session: Session
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
    getUserBySessionToken(token: String): User!
    getUserWithPasswordHashByUsername(name: String!): User!
    getValidSessionByToken(token: String): Session!
  }

  type Mutation {
    createUser(name: String!, level: Int!, password: String!): AuthPayload
    createSession(token: String!, userId: Int!): Session!
    deleteExpiredSessions: Session!
    deleteSessionByToken(token: String): Success
    logUserIn(email: String!, password: String!): AuthPayload
    deleteUser(id: Int!): User
  }
`;
