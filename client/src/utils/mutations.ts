// import { gql } from '@apollo/client';

// export const LOGIN_USER = gql`
//   mutation login($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//       user {
//         _id
//         username
//       }
//     }
//   }
// `;

// export const ADD_USER = gql`
//   mutation addUser($username: String!, $email: String!, $password: String!) {
//     addUser(username: $username, email: $email, password: $password) {
//       token
//       user {
//         _id
//         username
//       }
//     }
//   }
// `;

// export const SAVE_BOOK = gql`
//   mutation saveBook($bookId: String!, $title: String!, $authors: [String!]!, $description: String!, $image: String!, $link: String!) {
//     saveBook(bookId: $bookId, title: $title, authors: $authors, description: $description, image: $image, link: $link) {
//       _id
//       savedBooks {
//         bookId
//         title
//       }
//     }
//   }
// `;

// export const REMOVE_BOOK = gql`
//   mutation removeBook($bookId: String!) {
//     removeBook(bookId: $bookId) {
//       _id
//       savedBooks {
//         bookId
//         title
//       }
//     }
//   }
// `;


import { gql } from '@apollo/client';

// Mutation to log in a user
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to save a book for the logged-in user
export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String!, $title: String!, $authors: [String!]!, $description: String!, $image: String!, $link: String!) {
    saveBook(bookId: $bookId, title: $title, authors: $authors, description: $description, image: $image, link: $link) {
      _id
      savedBooks {
        bookId
        title
      }
    }
  }
`;

// Mutation to remove a saved book from the logged-in user's collection
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      savedBooks {
        bookId
        title
      }
    }
  }
`;
