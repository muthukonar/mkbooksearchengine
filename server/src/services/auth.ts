import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to authenticate the token from headers
export const authenticateToken = (req: any, res: any, next: any) => {
  // Extract token from the authorization header, query string, or body
  let token = req.body.token || req.query.token || req.headers.authorization;

  

  // If the token is provided in the authorization header, split and get the actual token
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token is provided, proceed without attaching user data
  if (!token) {
    return next();
  }

  // Try to verify the token and attach user data to the request
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2h' });
    console.log('Token verified');

    // Attach the user data from the token payload to the request object
    req.user = data;
    return next();
  } catch (err) {
    console.log('Invalid token');
    return res.sendStatus(403); // Forbidden if token is invalid
  }
};

// Function to sign a token for the user with their data
export const signToken = (username: string, email: string, _id: unknown) => {
  // Payload for the token, containing the user information
  const payload = { username, email, _id };

  const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables

  // Return the signed token with an expiration of 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

// Custom AuthenticationError class that extends GraphQLError
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};


