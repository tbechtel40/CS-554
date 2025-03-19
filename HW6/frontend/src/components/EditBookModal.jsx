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

function EditBookModal(props) {
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [book, setBook] = useState(props.book);
  const {loading, error} = useQuery(queries.GET_BOOKS);
  const [editBook] = useMutation(queries.EDIT_BOOK);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBook(null);

    props.handleClose();
  };

  // const handleChange = (event) => {
  //   this.setState({value: event.target.value});
  // }

  let title;
  let publicationDate;
  let genre;
  let chapters;
  let authorId;
  let publisherId;
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
        contentLabel='Edit Book'
        style={customStyles}
      >
        <form
          className='form'
          id='add-book'
          onSubmit={(e) => {
            e.preventDefault();
            console.log("ID: " + authorId.value);
            let chapterArray = chapters.value.split(/\s*(?:,|$)\s*/);
            console.log(chapterArray);
            editBook({
              variables: {
                id: props.book._id,
                title: title.value,
                publicationDate: publicationDate.value,
                genre: genre.value,
                chapters: chapterArray,
                authorId: authorId.value,
                publisherId: publisherId.value
              },
              onError: (error) => {
                alert(error.message);
                console.log(error.message);
              }
            });
            title.value = "";
            publicationDate.value = "";
            genre.value = "";
            chapters.value = "";
            authorId.value = "";
            publisherId.value = "";
            setShowEditModal(false);

            props.handleClose();
          }}
        >
          <div className='form-group'>
            <label>
              Title:
              <br />
              <input
                ref={(node) => {
                  title = node;
                }}
                defaultValue={book.title}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Publication Date (MM/DD/YYYY):
              <br />
              <input
                ref={(node) => {
                  publicationDate = node;
                }}
                defaultValue={book.publicationDate}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Genre:
              <br />
              <input
                ref={(node) => {
                  genre = node;
                }}
                defaultValue={book.genre}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Chapters (separate with commas):
              <br />
              <input
                ref={(node) => {
                  chapters = node;
                }}
                defaultValue={book.chapters}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Author ID:
              <br />
              <input
                ref={(node) => {
                  authorId = node;
                }}
                defaultValue={book.author._id}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Publisher ID:
              <br />
              <input
                ref={(node) => {
                  publisherId = node;
                }}
                defaultValue={book.publisher._id}
              />
            </label>
          </div>

          <br />
          <br />
          <button className='button add-button' type='submit'>
            Update Book
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseEditModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default EditBookModal;
