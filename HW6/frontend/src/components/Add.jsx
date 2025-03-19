/* eslint-disable react/prop-types */

import '../App.css';
import {useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

function Add(props) {
  const [addAuthor] = useMutation(queries.ADD_AUTHOR, {
    update(cache, {data: {addAuthor}}) {
      const {authors} = cache.readQuery({
        query: queries.GET_AUTHORS
      });
      cache.writeQuery({
        query: queries.GET_AUTHORS,
        data: {authors: [...authors, addAuthor]}
      });
    }
  });

  const [addBook] = useMutation(queries.ADD_BOOK, {
    update(cache, {data: {addBook}}) {
      const {books} = cache.readQuery({
        query: queries.GET_BOOKS
      });
      cache.writeQuery({
        query: queries.GET_BOOKS,
        data: {books: [...books, addBook]}
      });
    }
  });

  const [addPublisher] = useMutation(queries.ADD_PUBLISHER, {
    update(cache, {data: {addPublisher}}) {
      const {publishers} = cache.readQuery({
        query: queries.GET_PUBLISHERS
      });
      cache.writeQuery({
        query: queries.GET_PUBLISHERS,
        data: {publishers: [...publishers, addPublisher]}
      });
    }
  });

  const onSubmitAuthor = (e) => {
    e.preventDefault();
    let name = document.getElementById('name');
    let bio = document.getElementById('bio');
    let dateOfBirth = document.getElementById('dateOfBirth');
    addAuthor({
      variables: {
        name: name.value,
        bio: bio.value,
        dateOfBirth: dateOfBirth.value
      },
      onError: (error) => {
        alert(error.message);
        console.log(error.message);
      }
    });

    document.getElementById('add-author').reset();
    props.closeAddFormState();
  };

  const onSubmitBook = (e) => {
    e.preventDefault();
    let title = document.getElementById('title');
    let publicationDate = document.getElementById('publicationDate');
    let genre = document.getElementById('genre');
    let chapters = document.getElementById('chapters');
    let authorId = document.getElementById('authorId');
    let publisherId = document.getElementById('publisherId');
    let chapterArray = chapters.value.split(/\s*(?:,|$)\s*/);
    console.log(chapterArray);
    addBook({
      variables: {
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

    document.getElementById('add-book').reset();
    props.closeAddFormState();
  };

  const onSubmitPublisher = (e) => {
    e.preventDefault();
    let name = document.getElementById('name');
    let establishedYear = document.getElementById('establishedYear');
    let location = document.getElementById('location');
    addPublisher({
      variables: {
        name: name.value,
        establishedYear: parseInt(establishedYear.value),
        location: location.value
      },
      onError: (error) => {
        alert(error.message);
        console.log(error.message);
      }
    });

    document.getElementById('add-publisher').reset();
    props.closeAddFormState();
  };

  let body = null;
  if (props.type === 'author') {
    body = (
      <div className='card'>
        <form className='form' id='add-author' onSubmit={onSubmitAuthor}>
          <div className='form-group'>
            <label>
              Author Name:
              <br />
              <input id='name' required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Author Bio:
              <br />
              <input id='bio' autoFocus={true} />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Author Date of Birth (MM/DD/YYYY):
              <br />
              <input id='dateOfBirth' required autoFocus={true} />
            </label>
          </div>
          <br />
          <button className='button' type='submit'>
            Add Author
          </button>
          <button
            type='button'
            className='button'
            onClick={() => {
              document.getElementById('add-author').reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  } else if (props.type === "book") {
    body = (
        <div className='card'>
          <form className='form' id='add-book' onSubmit={onSubmitBook}>
            <div className='form-group'>
              <label>
                Book Title:
                <br />
                <input id='title' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Publication Date:
                <br />
                <input id='publicationDate' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Genre:
                <br />
                <input id='genre' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Chapters (separate with commas):
                <br />
                <input id='chapters' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                authorId:
                <br />
                <input id='authorId' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                publisherId:
                <br />
                <input id='publisherId' required autoFocus={true} />
              </label>
            </div>
            <br />
            <button className='button' type='submit'>
              Add Book
            </button>
            <button
              type='button'
              className='button'
              onClick={() => {
                document.getElementById('add-book').reset();
                props.closeAddFormState();
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      );
  } else if (props.type === "publisher") {
    body = (
        <div className='card'>
          <form className='form' id='add-publisher' onSubmit={onSubmitPublisher}>
            <div className='form-group'>
              <label>
                Publisher Name:
                <br />
                <input id='name' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Established Year:
                <br />
                <input id='establishedYear' required autoFocus={true} />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Location:
                <br />
                <input id='location' required autoFocus={true} />
              </label>
            </div>
            <br />
            <button className='button' type='submit'>
              Add Publisher
            </button>
            <button
              type='button'
              className='button'
              onClick={() => {
                document.getElementById('add-publisher').reset();
                props.closeAddFormState();
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      );
  }
  return <div>{body}</div>;
}

export default Add;
