import { gql } from 'apollo-server';

export type User = {
  id: number;
  username: String;
  userlevel: number;
  passwordHash: String;
  sessionId: number;
};

export type Session = {
  id: number;
  token: String;
  expiryTimestamp: string;
  userId: number;
};

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    userlevel: Int!
    accountVal: Float!
    passwordHash: String
    sessionId: Int
  }

  type Session {
    id: ID!
    token: String!
    expiryTimestamp: DateTime!
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
    getUserExists(name: String): AuthPayload
    getUserByUsername(name: String): User
    getUserBySessionToken: User
    getUserWithPasswordHashByUsername(name: String!): User!
    getValidSessionByToken: Session!
  }

  type Mutation {
    createUser(
      name: String!
      level: Int!
      accountVal: Int!
      password: String!
    ): AuthPayload
    createSession(token: String!, userId: Int!): Session!
    deleteExpiredSessions: Session!
    deleteSessionByToken: Success
    deleteSessionByTokenManual(token: String!): Success
    logUserIn(name: String!, password: String!): AuthPayload!
    deleteUser(id: Int!): User
    changeUserSessionId(userId: Int!, id: Int!): Success
  }
`;
