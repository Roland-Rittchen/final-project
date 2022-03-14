import { gql } from 'apollo-server';

export type User = {
  id: number;
  username: String;
  userlevel: number;
  password_hash: String;
  session: Session;
};

export type Session = {
  id: number;
  token: String;
  expiry_timestamp: string;
  user: User;
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
    getUserByUsername(name: String): User!
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
