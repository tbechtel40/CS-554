import '../App.css';
import {useQuery} from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import queries from '../queries';
import { useState } from 'react';
import {Card, CardHeader, CardContent, Typography} from "@mui/material"
import DeleteAuthorModal from './DeleteAuthorModal';
import EditAuthorModal from './EditAuthorModal';

function AuthorId() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [deleteAuthor, setDeleteAuthor] = useState(null);

  const handleOpenEditModal = (author) => {
    setShowEditModal(true);
    setEditAuthor(author);
  };

  const handleOpenDeleteModal = (author) => {
    setShowDeleteModal(true);
    setDeleteAuthor(author);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };


  let {id} = useParams();
  console.log(id);

  const {loading, error, data} = useQuery(
    queries.GET_AUTHOR_BY_ID,
    {
      variables: {id},
      fetchPolicy: 'cache-and-network'
    }
  );

  let authorBooks;

  if (data && data.getAuthorById) {
    const author = data.getAuthorById;
    console.log(author)
    console.log(author.books)

    if (author.books && author.books.length > 0) {
        authorBooks =
              author.books &&
              author.books.map((book) => {
                return <Link key={book._id} to={`/books/${book._id}`}>{book.title}<br/></Link>;
            });
    } else {
        authorBooks = undefined;
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
      title={author.name}
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
            Biography:
            {author.bio ? (
              <div>{author.bio}</div>
            ) : (
              <div>N/A</div>
            )}

            Date of Birth:
            {author.dateOfBirth ? (
                <div>{author.dateOfBirth}</div>
            ) : (
                <div>N/A</div>
            )}

            Number of Published Books:
            {author.numOfBooks !== undefined ? (
                <div>{author.numOfBooks}</div>
            ) : (
                <div>N/A</div>
            )}

            Published Books:
            {author.books && author.books.length > 0 ? (
                <div>{authorBooks}</div>
            ) : (
                <div>N/A</div>
            )}

            {showEditModal && (
                <EditAuthorModal
                    isOpen={showEditModal}
                    author={editAuthor}
                    handleClose={handleCloseModals}
                />
            )}

            {showDeleteModal && (
                <DeleteAuthorModal
                    isOpen={showDeleteModal}
                    handleClose={handleCloseModals}
                    deleteAuthor={deleteAuthor}
                />
            )}

                <button
                  className='button'
                  onClick={() => {
                    handleOpenEditModal(author);
                  }}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenDeleteModal(author);
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

export default AuthorId;
