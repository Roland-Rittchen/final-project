import crypto from 'node:crypto';
import { ServerResponse } from 'node:http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { verifyCsrfToken } from './util/auth';
import { createCsrfToken } from './util/auth.js';
import {
  createSession,
  createUser,
  deleteSessionByToken,
  getAllSessions,
  getAllUsers,
  getUserById,
  getUserWithPasswordHashByUsername,
} from './util/connectToDatabase.js';
import { createSerializedRegisterSessionTokenCookie } from './util/cookies';
import { typeDefs } from './util/gqlTypedefs.js';

// const csrfTokenMatches = verifyCsrfToken(request.body.csrfToken);

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getAllUsers: (parent: void, args: {}, context: { res: ServerResponse }) => {
      return getAllUsers();
    },
    getAllSessions: (
      parent: void,
      args: {},
      context: { res: ServerResponse },
    ) => {
      return getAllSessions();
    },
    getUserById: (
      parent: void,
      args: { id: string },
      context: { res: ServerResponse },
    ) => {
      return getUserById(parseInt(args.id));
    },
  },
  Mutation: {
    async createUser(
      parent: void,
      args: { name: string; level: string; password: string },
      context: { res: ServerResponse },
    ) {
      const passwordHash = await bcrypt.hash(args.password, 12);
      const user = await createUser(
        args.name,
        parseInt(args.level),
        passwordHash,
      );

      // 1. Create a unique token
      const token = crypto.randomBytes(64).toString('base64');

      // 2. Create the session
      const session = await createSession(token, user.id);

      console.log(session);

      // 3. Serialize the cookie
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        session.token,
      );

      context.res.setHeader('Set-Cookie', serializedCookie);
      return {
        token: createCsrfToken(),
        user: user,
        error: '',
      };
    },
    async logUserIn(
      parent: void,
      args: { name: string; password: string },
      context: { res: ServerResponse },
    ) {
      const user = await getUserWithPasswordHashByUsername(args.name);
      if (!user) {
        return {
          token: '',
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
          token: '',
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
      return { token: createCsrfToken(), user: user, error: '' };
    },
  },
  async deleteSessionByToken(
    parent: void,
    args: {},
    context: { res: ServerResponse },
  ) {
    const session = await deleteSessionByToken(
      context.res.getHeader('Set-Cookie'),
    );
    context.res.setHeader(
      'Set-Cookie',
      serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
    return session;
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

const startServer = apolloServer.start();

export default async function graphQlHandler(
  req: MicroRequest,
  res: ServerResponse,
) {
  // Headers for Apollo Studio
  // https://stackoverflow.com/a/68890931/1268612
  Object.entries({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': 'https://studio.apollographql.com',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods':
      'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD',
  }).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

// The `listen` method launches a web server.
// apolloServer
//   .listen({ port: 4000 })
//   .then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`);
//   })
//   .catch((e) => console.log(e));
