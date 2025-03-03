// import { Profile } from '../models/index.js';
// import { signToken, AuthenticationError } from '../utils/auth.js';

// interface Profile {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   skills: string[];
// }

// interface ProfileArgs {
//   profileId: string;
// }

// interface AddProfileArgs {
//   input:{
//     name: string;
//     email: string;
//     password: string;
//   }
// }

// interface AddSkillArgs {
//   profileId: string;
//   skill: string;
// }

// interface RemoveSkillArgs {
//   profileId: string;
//   skill: string;
// }

// interface Context {
//   user?: Profile;
// }

// const resolvers = {
//   Query: {
//     profiles: async (): Promise<Profile[]> => {
//       return await Profile.find();
//     },
//     profile: async (_parent: any, { profileId }: ProfileArgs): Promise<Profile | null> => {
//       return await Profile.findOne({ _id: profileId });
//     },
//     me: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
//       if (context.user) {
//         return await Profile.findOne({ _id: context.user._id });
//       }
//       throw AuthenticationError;
//     },
//   },
//   Mutation: {
//     addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: Profile }> => {
//       const profile = await Profile.create({ ...input });
//       const token = signToken(profile.name, profile.email, profile._id);
//       return { token, profile };
//     },
//     login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
//       const profile = await Profile.findOne({ email });
//       if (!profile) {
//         throw AuthenticationError;
//       }
//       const correctPw = await profile.isCorrectPassword(password);
//       if (!correctPw) {
//         throw AuthenticationError;
//       }
//       const token = signToken(profile.name, profile.email, profile._id);
//       return { token, profile };
//     },
//     addSkill: async (_parent: any, { profileId, skill }: AddSkillArgs, context: Context): Promise<Profile | null> => {
//       if (context.user) {
//         return await Profile.findOneAndUpdate(
//           { _id: profileId },
//           {
//             $addToSet: { skills: skill },
//           },
//           {
//             new: true,
//             runValidators: true,
//           }
//         );
//       }
//       throw AuthenticationError;
//     },
//     removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
//       if (context.user) {
//         return await Profile.findOneAndDelete({ _id: context.user._id });
//       }
//       throw AuthenticationError;
//     },
//     removeSkill: async (_parent: any, { skill }: RemoveSkillArgs, context: Context): Promise<Profile | null> => {
//       if (context.user) {
//         return await Profile.findOneAndUpdate(
//           { _id: context.user._id },
//           { $pull: { skills: skill } },
//           { new: true }
//         );
//       }
//       throw AuthenticationError;
//     },
//   },
// };

// export default resolvers;



import { User } from '../models/index.js'; 
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
