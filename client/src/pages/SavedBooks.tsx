import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries.js';  
import { REMOVE_BOOK } from '../utils/mutations.js'; 
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image?: string;
  link?: string;
}

interface GetMeData {
  getMe: {
    savedBooks: Book[];
  };
}

const SavedBooks = () => {
  const { loading, error, data } = useQuery<GetMeData>(GET_ME); 
  const [removeBook] = useMutation(REMOVE_BOOK);
 
  if (loading) return <h2>LOADING...</h2>;
  
  if (error) return <h2>Error loading saved books!</h2>;

  
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    
    if (!token) {
      return;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      console.log('Book removed', data);
      removeBookId(bookId);  
    } catch (err) {
      console.error('Error removing book:', err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {data?.getMe.savedBooks.length
            ? `Viewing ${data.getMe.savedBooks.length} saved books:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data?.getMe.savedBooks.map((book) => {
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
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
