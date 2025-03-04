

import  User  from '../models/index.js'; 
import { signToken, AuthenticationError } from '../utils/auth.js';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
}

interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
        me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    
    savedBooks: async (_parent: any, _args: any, context: Context): Promise<Book[]> => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id });
        return user ? user.savedBooks : [];
      }
      throw AuthenticationError;
    },

    searchBooks: async (_parent: any, { query }: { query: string }): Promise<Book[]> => {
      return await searchBooks(query);  
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<AuthPayload> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    signup: async (_parent: any, { username, email, password }: AddUserArgs): Promise<AuthPayload> => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookId }: { bookId: string }, context: Context): Promise<User | null> => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );
        return user;
      }
      throw AuthenticationError;
    },

    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: Context): Promise<User | null> => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return user;
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
