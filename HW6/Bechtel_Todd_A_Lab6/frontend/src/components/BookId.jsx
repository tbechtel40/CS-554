import '../App.css';
import {useQuery} from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import queries from '../queries';
import { useState } from 'react';
import {Card, CardHeader, CardContent, Typography} from "@mui/material"
import DeleteBookModal from './DeleteBookModal';
import EditBookModal from './EditBookModal';

function BookId() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  const handleOpenEditModal = (book) => {
    setShowEditModal(true);
    setEditBook(book);
  };

  const handleOpenDeleteModal = (book) => {
    setShowDeleteModal(true);
    setDeleteBook(book);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };


  let {id} = useParams();
  console.log(id);

  const {loading, error, data} = useQuery(
    queries.GET_BOOK_BY_ID,
    {
      variables: {id},
      fetchPolicy: 'cache-and-network'
    }
  );


  if (data && data.getBookById) {
    const book = data.getBookById;
    console.log(book);

    let bookChapters;
    if (book.chapters) {
        bookChapters = book.chapters &&
        book.chapters.map((chapter, index) => {
            return <div key={index}>
                {chapter} <br/>
            </div>;
        })
    }

    return (
        <Card
    variant='outlined'
    sx={{
      maxWidth: 550,
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 5,
      border: '4px solid #1e8678',
      boxShadow:
        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    }}
  >
    <CardHeader
      title={book.title}
      sx={{
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
      }}
    />

    <CardContent>
      <Typography
        variant='body2'
        color='textSecondary'
        component='span'
        sx={{
          borderBottom: '1px solid #1e8678',
          fontWeight: 'bold'
        }}
      >
            Author:
            {book.author ? (
              <div><Link to={`/authors/${book.author._id}`}>{book.author.name}</Link></div>
            ) : (
              <div>N/A</div>
            )}

            Publisher:
            {book.publisher ? (
                <div><Link to={`/publishers/${book.publisher._id}`}>{book.publisher.name}</Link></div>
            ) : (
                <div>N/A</div>
            )}

            Genre:
            {book.genre !== undefined ? (
                <div>{book.genre}</div>
            ) : (
                <div>N/A</div>
            )}

            Publication Date:
            {book.publicationDate !== undefined ? (
                <div>{book.publicationDate}</div>
            ) : (
                <div>N/A</div>
            )}

            List of Chapters:
            {book.chapters !== undefined ? (
                <div>{bookChapters}</div>
            ) : (
                <div>N/A</div>
            )}


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

      </Typography>
    </CardContent>
  </Card>);
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default BookId;
