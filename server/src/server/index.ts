import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import models from '../models';

import buildSchema from './utils/buildSchema';
import getUser from './utils/getUser';
import createDataLoaders from '../dataloaders/createDataLoaders';

const { MONGO_URI, PORT = '4000' } = process.env;

export default async function startServer() {
  try {
    if (!MONGO_URI) throw new Error('Missing mongo config');

    await mongoose.connect(MONGO_URI);

    // Turn this on to see query output locally
    // mongoose.set('debug', true);

    const schema = buildSchema();

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
      schema,
      csrfPrevention: true,
    });

    await startStandaloneServer(server, {
      // A named context function is required if you are not
      // using ApolloServer<BaseContext>
      context: async ({ req }) => {
        let currentUser;

        if (req?.headers?.authorization?.includes('Bearer')) {
          currentUser = await getUser(req?.headers?.authorization, models);
        }

        return {
          currentUser,
          dataLoaders: createDataLoaders(models),
          models,
        };
      },
      listen: { port: parseInt(PORT, 10) },
    });
  } catch (err: any) {
    console.log(`Error starting server: ${err.toString()}`);
  }
}
