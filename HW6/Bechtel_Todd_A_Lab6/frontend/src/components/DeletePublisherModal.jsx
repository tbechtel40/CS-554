/* eslint-disable react/prop-types */

import {useState} from 'react';
import '../App.css';
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

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

function DeletePublisherModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [publisher, setPublisher] = useState(props.deletePublisher);

  const [removePublisher] = useMutation(queries.DELETE_PUBLISHER, {
    update(cache) {
      cache.modify({
        fields: {
          employees(existingPublishers, {readField}) {
            return existingPublishers.filter(
              (empRef) => publisher._id !== readField('_id', empRef)
            );
          }
        }
      });
    }
  });

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPublisher(null);
    props.handleClose();
  };

  return (
    <div>
      {/*Delete Publisher Modal */}
      <ReactModal
        name='deleteModal'
        isOpen={showDeleteModal}
        contentLabel='Delete Publisher'
        style={customStyles}
      >
        {/*Here we set up the mutation, since I want the data on the page to update
				after I have added someone, I need to update the cache. If not then
				I need to refresh the page to see the data updated 

				See: https://www.apollographql.com/docs/react/essentials/mutations for more
				information on Mutations
			*/}
        <div>
          <p>
            Are you sure you want to delete {publisher.name}?
          </p>

          <form
            className='form'
            id='delete-publisher'
            onSubmit={(e) => {
              e.preventDefault();
              removePublisher({
                variables: {
                  id: publisher._id
                }
              });
              setShowDeleteModal(false);

              props.handleClose();
            }}
          >
            <br />
            <br />
            <button className='button add-button' type='submit'>
              Delete Publisher
            </button>
          </form>
        </div>

        <br />
        <br />
        <button
          className='button cancel-button'
          onClick={handleCloseDeleteModal}
        >
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default DeletePublisherModal;
