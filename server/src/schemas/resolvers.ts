

import User from '../models/User'; 
import Book from '../models/Book'; 
import { signToken } from '../services/auth'; 
import { UserDocument } from '../models/User'; 

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      return context.user || null;
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id); 
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: { username: string, email: string, password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id); 
      return { token, user };
    },
    saveBook: async (_parent: any, { bookId, title, authors, description, image, link }: { bookId: string, title: string, authors: string[], description: string, image: string, link: string }, context: any) => {
      const user = context.user as UserDocument;
      if (!user) throw new Error('You need to be logged in');

      
      const book = new Book({ bookId, title, authors, description, image, link });

      
      user.savedBooks.push(book);
      await user.save();
      return user;
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      const user = context.user as UserDocument;
      if (!user) throw new Error('You need to be logged in');

     
      user.savedBooks = user.savedBooks.filter((book) => book.bookId !== bookId);
      await user.save();
      return user;
    },
  },
};
