
import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface LoginUserArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface BookArgs {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface userContext {
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      console.log(context);
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      console.log('context.user', context.user);
      throw new AuthenticationError('You need to be logged in.');
    },
  },


  Mutation: {
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
      console.log('token', token);
      console.log('user', user);
    },

    createUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookId, title, authors, description, image, link }: BookArgs, context: userContext) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }

      const user = await User.findById(context.user._id);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const book = {
        bookId,
        title,
        authors,
        description,
        image,
        link,
      };

      // Push the book to savedBooks array
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }

      const user = await User.findById(context.user._id);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      user.savedBooks = user.savedBooks.filter((book: any) => book.bookId !== bookId);
      await user.save();
      return user;
    },
  },
};

export default resolvers;
