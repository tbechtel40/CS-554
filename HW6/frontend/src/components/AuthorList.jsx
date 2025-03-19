import {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import { Link } from 'react-router-dom';
import DeleteAuthorModal from './DeleteAuthorModal';
import EditAuthorModal from './EditAuthorModal';
function AuthorList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [deleteAuthor, setDeleteAuthor] = useState(null);

  const {loading, error, data} = useQuery(queries.GET_AUTHORS, {
    fetchPolicy: 'cache-and-network'
  });
  const handleOpenEditModal = (author) => {
    setShowEditModal(true);
    setEditAuthor(author);
  };

  const handleOpenDeleteModal = (author) => {
    setShowDeleteModal(true);
    setDeleteAuthor(author);
  };
  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  if (data) {
    const {authors} = data;
    return (
      <div>
        <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
          Create Author
        </button>
        {showAddForm && (
          <Add type='author' closeAddFormState={closeAddFormState} />
        )}
        <br />
        <br />

        {authors.map((author) => {
          return (
            <div className='card' key={author._id}>
              <div className='card-body'>
                <h2 className='card-title'>
                <Link to={`/authors/${author._id}`}>{author.name}</Link>
                </h2>
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
                <br />
              </div>
            </div>
          );
        })}
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
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default AuthorList;
