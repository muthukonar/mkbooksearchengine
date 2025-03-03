// import gql from 'graphql-tag';

// const typeDefs = gql`
//   type Profile {
//     _id: ID
//     name: String
//     email: String
//     password: String
//     skills: [String]!
//   }

//   type Auth {
//     token: ID!
//     profile: Profile
//   }
  
//   input ProfileInput {
//     name: String!
//     email: String!
//     password: String!
//   }

//   type Query {
//     profiles: [Profile]!
//     profile(profileId: ID!): Profile
//     me: Profile
//   }

//   type Mutation {
//     addProfile(input: ProfileInput!): Auth
//     login(email: String!, password: String!): Auth

//     addSkill(profileId: ID!, skill: String!): Profile
//     removeProfile: Profile
//     removeSkill(skill: String!): Profile
//   }
// `;

// export default typeDefs;


import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    bookId: String!
    title: String!
    authors: [String]!
    description: String!
    image: String
    link: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Query {
    me: User
    savedBooks: [Book]
    searchBooks(query: String!): [Book]
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(username: String!, email: String!, password: String!): AuthPayload
    saveBook(bookId: String!): User
    removeBook(bookId: String!): User
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;