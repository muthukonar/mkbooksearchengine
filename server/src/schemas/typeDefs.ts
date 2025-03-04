

// import { gql } from 'apollo-server-express';
import gql from 'graphql-tag';

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
    _id: ID!
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