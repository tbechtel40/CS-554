import {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import { Link } from 'react-router-dom';
import DeleteBookModal from './DeleteBookModal';
import EditBookModal from './EditBookModal';
function BookList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  const {loading, error, data} = useQuery(queries.GET_BOOKS, {
    fetchPolicy: 'cache-and-network'
  });
  const handleOpenEditModal = (book) => {
    setShowEditModal(true);
    setEditBook(book);
  };

  const handleOpenDeleteModal = (book) => {
    setShowDeleteModal(true);
    setDeleteBook(book);
  };
  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  if (data) {
    const {books} = data;
    return (
      <div>
        <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
          Create Book
        </button>
        {showAddForm && (
          <Add type='book' closeAddFormState={closeAddFormState} />
        )}
        <br />
        <br />

        {books.map((book) => {
          return (
            <div className='card' key={book._id}>
              <div className='card-body'>
                <h2 className='card-title'>
                <Link to={`/books/${book._id}`}>{book.title}
                </Link>
                </h2>
                <h5>
                  {book.publicationDate} <br/>
                  {book.genre}
                </h5>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenEditModal(book);
                  }}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenDeleteModal(book);
                  }}
                >
                  Delete
                </button>
                <br />
              </div>
            </div>
          );
        })}
        {showEditModal && (
          <EditBookModal
            isOpen={showEditModal}
            book={editBook}
            handleClose={handleCloseModals}
          />
        )}

        {showDeleteModal && (
          <DeleteBookModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteBook={deleteBook}
          />
        )}
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default BookList;
