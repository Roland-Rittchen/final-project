import { ApolloServer } from 'apollo-server';
import { verifyCsrfToken } from './util/auth';
import { createCsrfToken } from './util/auth.js';
import {
  createUser,
  getAllUsers,
  getUserById,
} from './util/connectToDatabase.js';
import { typeDefs } from './util/gqlTypedefs.js';

const csrfTokenMatches = verifyCsrfToken(request.body.csrfToken);

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getAllUsers: () => {
      return getAllUsers();
    },
    getUserById: (parent, args) => {
      return getUserById(parseInt(args.id));
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      return {
        token: createCsrfToken(),
        user: createUser(args.name, parseInt(args.level), args.password),
      };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server
  .listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
  .catch((e) => console.log(e));
