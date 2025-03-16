import express, { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import mongoose from 'mongoose';
import { typeDefs, resolvers } from './schemas/index.js';
// import db from './config/connection.js';

const PORT = process.env.PORT || 3001;
const app = express();

interface Context {
  user: any;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: Request }): Context => {
    const user = req.user || null;
    return { user };
  },
} as any);

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};


startApolloServer();
