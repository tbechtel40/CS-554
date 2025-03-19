/* eslint-disable react/prop-types */

import {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function EditAuthorModal(props) {
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [author, setAuthor] = useState(props.author);
  const {loading, error} = useQuery(queries.GET_AUTHORS);
  const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setAuthor(null);

    props.handleClose();
  };

  let name;
  let bio;
  let dateOfBirth;
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div>
      <ReactModal
        name='editModal'
        isOpen={showEditModal}
        contentLabel='Edit Author'
        style={customStyles}
      >
        <form
          className='form'
          id='add-author'
          onSubmit={(e) => {
            console.log(name.value);
            console.log(bio.value);
            console.log(dateOfBirth.value);
            e.preventDefault();
            editAuthor({
              variables: {
                id: props.author._id,
                name: name.value,
                bio: bio.value,
                dateOfBirth: dateOfBirth.value
              },
              onError: (error) => {
                alert(error.message);
                console.log(error.message);
              }
            });
            name.value = '';
            bio.value = '';
            dateOfBirth.value = '';
            setShowEditModal(false);

            props.handleClose();
          }}
        >
          <div className='form-group'>
            <label>
              Name:
              <br />
              <input
                ref={(node) => {
                  name = node;
                }}
                defaultValue={author.name}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Bio:
              <br />
              <input
                ref={(node) => {
                  bio = node;
                }}
                defaultValue={author.bio}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Date of Birth (MM/DD/YYYY):
              <br />
              <input
                ref={(node) => {
                  dateOfBirth = node;
                }}
                defaultValue={author.dateOfBirth}
              />
            </label>
          </div>

          <br />
          <br />
          <button className='button add-button' type='submit'>
            Update Author
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseEditModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default EditAuthorModal;
