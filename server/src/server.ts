import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server'; // Use Apollo Server from @apollo/server
import { expressMiddleware } from '@apollo/server/express4'; // Express middleware for Apollo Server
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

const startServer = async () => {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();

  // Initialize Express app
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware for parsing URL-encoded data and JSON data
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Use Apollo Server middleware with custom context (auth)
  app.use('/graphql', expressMiddleware(server, {
    context: authenticateToken, // Pass the authenticateToken for context
  }));

  // Serve static files if in production environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Serve the main HTML file for any unmatched routes (for frontend routing)
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }

  // Connect to the database and start the server
  await db(); // Ensure the DB connection is established

  app.listen(PORT, () => {
    console.log(`🌍 API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Start the server
startServer();
