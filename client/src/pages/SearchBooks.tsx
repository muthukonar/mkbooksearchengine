
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations'; // Ensure path is correct
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import type { Book } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';

const searchGoogleBooks = async (query: string): Promise<any> => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  return response;
};

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();
      const bookData = items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || 'No description available',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      console.log('Books fetched:', bookData); // Debugging line

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };


  const handleSaveBook = async (bookId: string) => {
    const bookToSave: Book = searchedBooks.find((book) => book.bookId === bookId)!;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(Auth.getToken());

    if (!token) {
      console.error('You must be logged in to save a book');
      return;  // Ensure we don't proceed if there's no token.
    }

    try {
      const { data } = await saveBook({
        variables: {
          bookId: bookToSave.bookId,
          title: bookToSave.title,
          authors: bookToSave.authors,
          description: bookToSave.description,
          image: bookToSave.image,
          link: bookToSave.link,
        },
        // context: {
        //   headers: {
        //     Authorization: `Bearer ${token}`,  
        //   },
        // },
      });

      //   console.log('Book saved!');
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };



  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds.some(
                          (savedBookId: string) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds.some(
                          (savedBookId: string) => savedBookId === book.bookId
                        )
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};
console.log('Searchbooks page loaded');
export default SearchBooks;
