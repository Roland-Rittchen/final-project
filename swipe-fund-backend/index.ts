import crypto from 'node:crypto';
import { ServerResponse } from 'node:http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
// import { MicroRequest } from 'apollo-server-micro/dist/types';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import {
  createSession,
  createUser,
  deleteSessionByToken,
  deleteUser,
  getAllSessions,
  getAllUsers,
  getUserById,
  getUserWithPasswordHashByUsername,
} from './util/connectToDatabase.js';
import { createSerializedRegisterSessionTokenCookie } from './util/cookies.js';
import { typeDefs } from './util/gqlTypedefs';

// const url = 'http://localhost:4000/';
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getAllUsers: () => {
      return getAllUsers();
    },
    getAllSessions: () => {
      return getAllSessions();
    },
    getUserById: (parent: void, args: { id: string }) => {
      return getUserById(parseInt(args.id));
    },
  },
  Mutation: {
    createUser: async (
      parent: void,
      args: { name: string; level: string; password: string },
      context: { res: ServerResponse },
    ) => {
      const passwordHash = await bcrypt.hash(args.password, 12);
      const user = await createUser(
        args.name,
        parseInt(args.level),
        passwordHash,
      );
      // console.log('0.');
      // 1. Create a unique token
      const token = crypto.randomBytes(64).toString('base64');
      // console.log('1.');
      // 2. Create the session
      const session = await createSession(token, user.id);
      // console.log('2.');
      // console.log('2 session: ' + JSON.stringify(session));
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
          password_hash: '',
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
        expiry_timestamp: session[0].expiry_timestamp,
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
        user.password_hash,
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
      // 3. Serialize the cookie
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return { user: user, error: '' };
    },
    deleteSessionByToken: async (
      parent: void,
      args: {},
      context: { res: ServerResponse },
    ) => {
      const token = context.res.getHeader('Set-Cookie');
      if (token) {
        await deleteSessionByToken(token);
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
  context({ res }) {
    return {
      res,
    };
  },
});

apolloServer
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .catch((e) => console.log(e));

// const startServer = apolloServer.start();

// The `listen` method launches a web server.

// export default async function graphQlHandler(
//   req: MicroRequest,
//   res: ServerResponse,
// ) {
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader(
//     'Access-Control-Allow-Origin',
//     'https://studio.apollographql.com',
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers',
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD',
//   );

//   if (req.method === 'OPTIONS') {
//     res.end();
//     return false;
//   }

//   await startServer;
//   await apolloServer.createHandler({
//     path: '/api/graphql',
//   })(req, res);
// }
