import '../App.css';
import {useQuery} from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import queries from '../queries';
import { useState } from 'react';
import {Card, CardHeader, CardContent, Typography} from "@mui/material"
import DeletePublisherModal from './DeletePublisherModal';
import EditPublisherModal from './EditPublisherModal';

function PublisherId() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editPublisher, setEditPublisher] = useState(null);
  const [deletePublisher, setDeletePublisher] = useState(null);

  const handleOpenEditModal = (publisher) => {
    setShowEditModal(true);
    setEditPublisher(publisher);
  };

  const handleOpenDeleteModal = (publisher) => {
    setShowDeleteModal(true);
    setDeletePublisher(publisher);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };


  let {id} = useParams();
  console.log(id);

  const {loading, error, data} = useQuery(
    queries.GET_PUBLISHER_BY_ID,
    {
      variables: {id},
      fetchPolicy: 'cache-and-network'
    }
  );


  let publisherBooks;
  if (data && data.getPublisherById) {
    const publisher = data.getPublisherById;
    console.log(publisher)
    console.log(publisher.books)

    if (publisher.books && publisher.books.length > 0) {
        publisherBooks =
              publisher.books &&
              publisher.books.map((book) => {
                return <Link key={book._id} to={`/books/${book._id}`}>{book.title}<br/></Link>;
            });
    } else {
        publisherBooks = undefined;
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
      title={publisher.name}
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
            Location:
            {publisher.location ? (
              <div>{publisher.location}</div>
            ) : (
              <div>N/A</div>
            )}

            Established Year:
            {publisher.establishedYear ? (
                <div>{publisher.establishedYear}</div>
            ) : (
                <div>N/A</div>
            )}

            Number of Published Books:
            {publisher.numOfBooks !== undefined ? (
                <div>{publisher.numOfBooks}</div>
            ) : (
                <div>N/A</div>
            )}

            List of Books:
            {publisher.books && publisher.books.length > 0 ? (
                <div>{publisherBooks}</div>
            ) : (
                <div>N/A</div>
            )}


            {showEditModal && (
                <EditPublisherModal
                    isOpen={showEditModal}
                    publisher={editPublisher}
                    handleClose={handleCloseModals}
                />
            )}

            {showDeleteModal && (
                <DeletePublisherModal
                    isOpen={showDeleteModal}
                    handleClose={handleCloseModals}
                    deletePublisher={deletePublisher}
                />
            )}

                <button
                  className='button'
                  onClick={() => {
                    handleOpenEditModal(publisher);
                  }}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenDeleteModal(publisher);
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

export default PublisherId;
