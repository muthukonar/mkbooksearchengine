
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'node:url';  // Import fileURLToPath
import { dirname } from 'node:path';  // Import dirnam
const __filename = fileURLToPath(import.meta.url);  // Get current file path
const __dirname = dirname(__filename);  // Get current directory

import { typeDefs, resolvers } from './schemas/index.js'; // Adjust if necessary
import { authenticateToken } from './services/auth.js'; // Adjust path if necessary

const PORT = process.env.PORT || 3001;
const app = express();

// Set up Apollo Server with context that includes the authenticated user
const server = new ApolloServer({
  typeDefs,
  resolvers,
} as any);

// Start the Apollo Server and Express app
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Set up GraphQL endpoint
  app.use('/graphql', expressMiddleware(server,  {context: authenticateToken} ));

  // // Serve static files for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Handle routing for client-side routes
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mkgooglebooks')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

