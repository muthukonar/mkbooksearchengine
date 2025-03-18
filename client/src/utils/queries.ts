
import { gql } from '@apollo/client';

// Query to get the logged-in user's info
export const GET_ME = gql`
  query getMe  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Query to search books using Google Books API
export const SEARCH_GOOGLE_BOOKS = gql`
  query searchGoogleBooks($query: String!) {
    searchGoogleBooks(query: $query) {
      items {
        id
        volumeInfo {
          title
          authors
          description
          imageLinks {
            thumbnail
          }
          infoLink
        }
      }
    }
  }
`;
