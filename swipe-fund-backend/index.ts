import crypto from 'node:crypto';
import { ServerResponse } from 'node:http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import {
  changeUserSessionId,
  createSession,
  createUser,
  deleteSessionByToken,
  deleteUser,
  deleteUserSessionId,
  getAllSessions,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserExists,
  getUserWithPasswordHashByUsername,
  getValidSessionByToken,
} from './util/connectToDatabase.js';
import { createSerializedRegisterSessionTokenCookie } from './util/cookies.js';
import { typeDefs } from './util/gqlTypedefs.js';

// const url = 'http://localhost:4000/';
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getAllUsers: async () => {
      const resp = await getAllUsers();
      // console.log(resp);
      return resp;
    },
    getAllSessions: () => {
      return getAllSessions();
    },
    getUserById: (parent: void, args: { id: string }) => {
      return getUserById(parseInt(args.id));
    },
    getValidSessionByToken: async (parent: void, args: { token: string }) => {
      const session = await getValidSessionByToken(args.token);
      return session;
    },
    getUserBySessionToken: async (
      parent: void,
      args: {},
      context: { res: ServerResponse; req: any },
    ) => {
      const fullRequest = context.req;
      const sessionToken = fullRequest.get('cookie');
      if (sessionToken) {
        const cookie = decodeURIComponent(
          sessionToken.replace('sessionToken=', ''),
        );
        const session = await getValidSessionByToken(cookie);
        const user = await getUserById(session.userId);
        return user;
      }
      return;
    },
    getUserExists: async (parent: void, args: { name: string }) => {
      const resp = await getUserExists(args.name);
      // console.log(resp[0]);
      if (resp[0] !== undefined) {
        // console.log('user exists');
        const user = await getUserByUsername(args.name);
        // console.log(user);
        return { user: user, error: 'username already taken' };
      } else {
        // console.log('user not exist');
        return { user: {}, error: '' };
      }
    },
    getUserByUsername: async (parent: void, args: { name: string }) => {
      const user = await getUserByUsername(args.name);
      return user;
    },
    getUserWithPasswordHashByUsername: async (
      parent: void,
      args: { name: string },
    ) => {
      const user = await getUserWithPasswordHashByUsername(args.name);
      return user;
    },
  },
  Mutation: {
    createUser: async (
      parent: void,
      args: {
        name: string;
        level: number;
        accountVal: number;
        password: string;
      },
      context: { res: ServerResponse },
    ) => {
      // console.log('00');
      if (!args.name) {
        return { user: {}, error: 'no username provided' };
      }
      const resp = await getUserExists(args.name);
      if (resp[0] !== undefined) {
        return { user: {}, error: 'username already taken' };
      }
      if (!args.password) {
        return { user: {}, error: 'no password provided' };
      }
      const passwordHash = await bcrypt.hash(args.password, 12);
      const user = await createUser(
        args.name,
        args.level,
        args.accountVal,
        passwordHash,
      );
      // console.log('0.');
      // 1. Create a unique token
      const token = crypto.randomBytes(64).toString('base64');
      // console.log('1.');
      // 2. Create the session
      const session = await createSession(token, user.id);
      const update = await changeUserSessionId(user.id, session.id);
      if (!update) {
        return { user: {}, error: 'no session Id set' };
      }
      // 3. Serialize the cookie
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      // console.log('3.');
      // console.log('3. user: ' + JSON.stringify(user));
      context.res.setHeader('Set-Cookie', serializedCookie);
      return {
        user: {
          id: user.id,
          username: user.username,
          userlevel: user.userlevel,
          accountVal: user.accountVal,
          passwordHash: '',
          sessionId: session.id,
        },
        error: '',
      };
    },
    createSession: async (
      parent: void,
      args: { token: string; userID: string },
    ) => {
      const session = await createSession(args.token, parseInt(args.userID));
      return {
        id: session[0].id,
        token: session[0].token,
        expiryTimestamp: session[0].expiryTimestamp,
        userId: session[0].userId,
      };
    },
    logUserIn: async (
      parent: void,
      args: { name: string; password: string },
      context: { res: ServerResponse },
    ) => {
      const user = await getUserWithPasswordHashByUsername(args.name);
      if (!user) {
        return {
          user: {},
          error: 'Login information incorrect',
        };
      }
      // compare the pw with the hash (error if pw wrong)
      const passwordCorrect = await bcrypt.compare(
        args.password,
        user.passwordHash,
      );
      if (!passwordCorrect) {
        return {
          user: {},
          error: 'Password incorrect',
        };
      }
      // 1. Create a unique token
      const token = crypto.randomBytes(64).toString('base64');
      // 2. Create the session
      const session = await createSession(token, user.id);
      const update = await changeUserSessionId(user.id, session.id);
      if (!update) {
        return { user: {}, error: 'no session Id set' };
      }
      // 3. Serialize the cookie
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return {
        user: {
          id: user.id,
          username: user.username,
          userlevel: user.userlevel,
          accountVal: user.accountVal,
          sessionId: session.id,
        },
        error: '',
      };
    },
    deleteSessionByToken: async (
      parent: void,
      args: {},
      context: { res: ServerResponse; req: any },
    ) => {
      const fullRequest = context.req;
      const sessionToken = fullRequest.get('cookie');
      if (sessionToken) {
        const cookie = decodeURIComponent(
          sessionToken.replace('sessionToken=', ''),
        );
        const session = await getValidSessionByToken(cookie);
        await deleteSessionByToken(cookie);
        await deleteUserSessionId(session.userId);
        context.res.setHeader(
          'Set-Cookie',
          serialize('sessionToken', '', {
            maxAge: -1,
            path: '/',
          }),
        );
      }
      return;
    },
    deleteSessionByTokenManual: async (
      parent: void,
      args: { token: string },
    ) => {
      await deleteSessionByToken(args.token);
      return true;
    },
    deleteUser: async (parent: void, args: { id: string }) => {
      const user = await deleteUser(parseInt(args.id));
      return user;
    },
  },
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  // Return response to allow setting cookies in resolvers
  context({ res, req }) {
    return {
      res,
      req,
    };
  },
});

apolloServer
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .catch((e) => console.log(e));
