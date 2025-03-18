// import express, { Request } from 'express';
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import path from 'path';
// import mongoose from 'mongoose';
// import { typeDefs, resolvers } from './schemas/index.js';
// // import db from './config/connection.js';

// const PORT = process.env.PORT || 3001;
// const app = express();

// interface Context {
//   user: any;
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }: { req: Request }): Context => {
//     const user = req.user || null;
//     return { user };
//   },
// } as any);

// const startApolloServer = async () => {
//   await server.start();

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   app.use('/graphql', expressMiddleware(server));

//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));

//     app.get('*', (_req, res) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }
//   mongoose.connect(process.env.MONGODB_URI || '')
//     .then(() => {
//       console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//       console.error('Error connecting to MongoDB:', err);
//     });
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// };


// startApolloServer();



// import express, { Request } from 'express';
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import path from 'path';
// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import { typeDefs, resolvers } from './schemas/index.js'; // Adjust if necessary
// import { AuthenticationError } from './services/auth.js'; // Adjust path if necessary

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Interface for the context, which contains the authenticated user
// interface Context {
//   user: any;
// }

// // Function to verify and decode the JWT token
// const getUserFromToken = (token: string) => {
//   if (!token) return null;
//   try {
//     const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || '');
//     return decoded; // Return decoded user info (e.g., user ID)
//   } catch (error) {
//     throw new AuthenticationError('Invalid or expired token');
//   }
// };

// // Set up Apollo Server with context that includes the authenticated user
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }: { req: Request }): Context => {
//     // Get the token from the Authorization header
//     const token = req.headers.authorization || '';
    
//     // Decode and verify the token, adding the user to the context
//     const user = getUserFromToken(token);
    
//     return { user }; // Pass the user to the context
//   },
// } as any);



// // Start the Apollo Server and Express app
// const startApolloServer = async () => {
//   await server.start();

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   // Set up GraphQL endpoint
//   app.use('/graphql', expressMiddleware(server));

//   // Serve static files for production
//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));

//     // Handle routing for client-side routes
//     app.get('*', (_req, res) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }

//   // Connect to MongoDB
//   mongoose.connect(process.env.MONGODB_URI || '')
//     .then(() => {
//       console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//       console.error('Error connecting to MongoDB:', err);
//     });

//   // Start the server
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// };

// startApolloServer();


import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
import { typeDefs, resolvers } from './schemas/index.js'; // Adjust if necessary
import { authenticateToken } from './services/auth.js'; // Adjust path if necessary

const PORT = process.env.PORT || 3001;
const app = express();

// Interface for the context, which contains the authenticated user
// interface Context {
//   user: any;
// }

// Function to verify and decode the JWT token
// const getUserFromToken = (token: string) => {
//   if (!token) return null;


//   try {
//     console.log('token', token);
//     // Remove the 'Bearer ' prefix and verify the token
//     const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY || '');
//     return decoded; // Return decoded user info (e.g., user ID)
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     throw new AuthenticationError('Invalid or expired token');
//   }
// };

// Set up Apollo Server with context that includes the authenticated user
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context:  authenticateToken
  // context: ({ req }: { req: Request }): Context => {
  //   // Get the token from the Authorization header
  //   const token = req.headers.authorization || '';

  //   // Decode and verify the token, adding the user to the context
  //   const user = getUserFromToken(token);

  //   if (!user) {
  //     console.error('User not found or invalid token');
  //   }
  //  req.user = user;
  //   return req ; // Pass the user to the context
  // },
} as any);

// Start the Apollo Server and Express app
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Set up GraphQL endpoint
  app.use('/graphql', expressMiddleware(server,  {context: authenticateToken} ));

  // Serve static files for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle routing for client-side routes
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || '')
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

