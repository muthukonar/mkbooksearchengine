import gql from 'graphql-tag';


export const typeDefs = gql`
  type Book {
    bookId: String!
    authors: [String!]!
    description: String!
    title: String!
    image: String!
    link: String!
  }

  type User {
    _id: String!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(username: String!): User 
    savedBooks: [Book]!
    book(bookId: String!): Book
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, title: String!, authors: [String!]!, description: String!, image: String!, link: String!): User
    removeBook(bookId: String!): User
  }
`;



