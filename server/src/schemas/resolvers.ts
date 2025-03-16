// import User from '../models/User.js'; // Importing the User model
// import { signToken, AuthenticationError } from '../services/auth.js'; // Assuming signToken and AuthenticationError are in a utils file

// // Define types for the arguments
// interface LoginUserArgs {
//   email: string;
//   password: string;
// }

// interface AddUserArgs {
//   username: string;
//   email: string;
//   password: string;
// }

// interface BookArgs {
//   bookId: string;
//   title: string;
//   authors: string[];
//   description: string;
//   image: string;
//   link: string;
// }

// const resolvers = {
//   Query: {
//     me: async (_parent: any, _args: any, context: any) => {
//       if (context.user) {
//         return User.findOne({ _id: context.user._id }).populate('savedBooks');
//       }
//       throw new AuthenticationError('You need to be logged in.');
//     },
//   },
//   Mutation: {
//     login: async (_parent: any, { email, password }: LoginUserArgs) => {
//       // Find user by email
//       const user = await User.findOne({ email });
//       if (!user || !(await user.isCorrectPassword(password))) {
//         throw new AuthenticationError('Invalid credentials');
//       }

//       // Sign a token and return user and token
//       const token = signToken(user.username, user.email, user._id);
//       return { token, user };
//     },

//     addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
//       // Create new user
//       const user = await User.create({ username, email, password });

//       // Sign a token and return user and token
//       const token = signToken(user.username, user.email, user._id);
//       return { token, user };
//     },

//     saveBook: async (_parent: any, { bookId, title, authors, description, image, link }: BookArgs, context: any) => {
//       if (!context.user) {
//         throw new AuthenticationError('You need to be logged in');
//       }

//       // Create a new book object (no need for a Mongoose model here)
//       const book = {
//         bookId,
//         title,
//         authors,
//         description,
//         image,
//         link,
//       };

//       // Find the user and add the book to savedBooks
//       const user = await User.findById(context.user._id);
//       if (!user) {
//         throw new AuthenticationError('User not found');
//       }

//       // Push the new book object to the savedBooks array
//       user.savedBooks.push(book);

//       // Save the user document
//       await user.save();

//       return user;
//     },

//     removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
//       if (!context.user) {
//         throw new AuthenticationError('You need to be logged in');
//       }

//       // Find user and remove book from savedBooks array
//       const user = await User.findById(context.user._id);
//       if (!user) {
//         throw new AuthenticationError('User not found');
//       }

//       user.savedBooks = user.savedBooks.filter((book) => book.bookId !== bookId);
//       await user.save();

//       return user;
//     },
//   },
// };

// export default resolvers;


import User from '../models/User.js'; // Importing the User model
import { signToken, AuthenticationError } from '../services/auth.js'; // Assuming signToken and AuthenticationError are in a utils file

// Define types for the arguments
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

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
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
    },

    addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookId, title, authors, description, image, link }: BookArgs, context: any) => {
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
      
      user.savedBooks.push(book as any); // Ensure type compatibility
      await user.save();
      return user;
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
