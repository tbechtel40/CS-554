import {gql} from '@apollo/client';

const GET_AUTHORS = gql`
  query {
    authors {
        _id
        name
        bio
        dateOfBirth
    }
  }
`;

const GET_AUTHOR_BY_ID = gql`
  query getAuthorInfo($id: String!) {
    getAuthorById(_id: $id) {
      _id
      name
      bio
      dateOfBirth
      books {
        _id
        title
      }
      numOfBooks
    }
  }
`;

const GET_BOOKS = gql`
  query {
    books {
        _id
        title
        author {
            _id
        }
        publisher {
            _id
        }
        genre
        publicationDate
        chapters
    }
  }
`;

const GET_BOOK_BY_ID = gql`
  query getBookInfo($id: String!) {
    getBookById(_id: $id) {
      _id
      title
      author {
        _id
        name
      }
      publisher {
        _id
        name
      }
      genre
      publicationDate
      chapters
    }
  }
`;

const GET_PUBLISHER_BY_ID = gql`
  query getPublisherInfo($id: String!) {
    getPublisherById(_id: $id) {
      _id
      name
      establishedYear
      location
      numOfBooks
      books {
        _id
        title
      }
    }
  }
`;

const GET_PUBLISHERS = gql`
  query {
    publishers {
        _id
        name
        location
        establishedYear
    }
  }
`;

const BOOKS_BY_GENRE = gql`
  query getBookGenre($genre: Genre!) {
    booksByGenre(genre: $genre) {
      _id
      title
      author {
        _id
        name
      }
      publisher {
        _id
        name
      }
      genre
      publicationDate
      chapters
    }
  }
`;

const PUBLISHERS_BY_ESTABLISHED_YEAR = gql`
  query getPublisherEstablished(
    $min: Int!
    $max: Int!
  ) {
    publishersByEstablishedYear(
      min: $min
      max: $max
    ) {
      _id
      name
      establishedYear
      location
      numOfBooks
      books {
        _id
        title
      }
    }
  }
`;

const SEARCH_AUTHOR_BY_NAME = gql`
  query searchAuthorName($searchTerm: String!) {
    searchAuthorByName(searchTerm: $searchTerm) {
      _id
      name
      bio
      dateOfBirth
      books {
        _id
        title
      }
      numOfBooks
    }
  }
`;

const SEARCH_BOOK_BY_TITLE = gql`
  query getBookTitle($searchTerm: String!) {
    searchBookByTitle(searchTerm: $searchTerm) {
      _id
      title
      author {
        _id
        name
      }
      publisher {
        _id
        name
      }
      genre
      publicationDate
      chapters
    }
  }
`;

const ADD_AUTHOR = gql`
  mutation createAuthor(
    $name: String!
    $bio: String
    $dateOfBirth: String!
  ) {
    addAuthor(
      name: $name
      bio: $bio
      dateOfBirth: $dateOfBirth
    ) {
      _id
      name
      bio
      dateOfBirth
    }
  }
`;

const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $publicationDate: String!
    $genre: Genre!
    $chapters: [String!]!
    $authorId: String!
    $publisherId: String!
  ) {
    addBook(
      title: $title
      publicationDate: $publicationDate
      genre: $genre
      chapters: $chapters
      authorId: $authorId
      publisherId: $publisherId
    ) {
      _id
      title
      publicationDate
      genre
    }
  }
`;

const ADD_PUBLISHER = gql`
  mutation createPublisher(
    $name: String!
    $establishedYear: Int!
    $location: String!
  ) {
    addPublisher(
      name: $name
      establishedYear: $establishedYear
      location: $location
    ) {
      _id
      name
      establishedYear
      location
      numOfBooks
    }
  }
`;

const DELETE_AUTHOR = gql`
  mutation deleteAuthor($id: String!) {
    removeAuthor(_id: $id) {
      _id
      name
      bio
      dateOfBirth
    }
  }
`;

const DELETE_BOOK = gql`
  mutation deleteBook($id: String!) {
    removeBook(_id: $id) {
      _id
      title
    }
  }
`;

const DELETE_PUBLISHER = gql`
  mutation deletePublisher($id: String!) {
    removePublisher(_id: $id) {
      _id
      name
      establishedYear
      location
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation changeAuthor(
    $id: String!
    $name: String
    $bio: String
    $dateOfBirth: String
  ) {
    editAuthor(
      _id: $id
      name: $name
      bio: $bio
      dateOfBirth: $dateOfBirth
    ) {
      _id
      name
      bio
      dateOfBirth
    }
  }
`;

const EDIT_BOOK = gql`
  mutation changeBook(
    $id: String!
    $title: String
    $publicationDate: String
    $genre: Genre
    $chapters: [String!]
    $authorId: String
    $publisherId: String
  ) {
    editBook(
      _id: $id
      title: $title
      publicationDate: $publicationDate
      genre: $genre
      chapters: $chapters
      authorId: $authorId
      publisherId: $publisherId
    ) {
      _id
      title
      publicationDate
      genre
      author {
        _id
      }
      publisher {
        _id
      }
    }
  }
`;

const EDIT_PUBLISHER = gql`
  mutation changePublisher(
    $id: String!
    $name: String
    $establishedYear: Int
    $location: String
  ) {
    editPublisher(
      _id: $id
      name: $name
      establishedYear: $establishedYear
      location: $location
    ) {
      _id
      name
      establishedYear
      location
    }
  }
`;

let exported = {
  GET_AUTHORS,
  GET_BOOKS,
  GET_PUBLISHERS,

  ADD_AUTHOR,
  ADD_BOOK,
  ADD_PUBLISHER,

  EDIT_AUTHOR,
  EDIT_BOOK,
  EDIT_PUBLISHER,

  DELETE_AUTHOR,
  DELETE_BOOK,
  DELETE_PUBLISHER,

  GET_AUTHOR_BY_ID,
  GET_BOOK_BY_ID,
  GET_PUBLISHER_BY_ID,

  BOOKS_BY_GENRE,
  PUBLISHERS_BY_ESTABLISHED_YEAR,
  SEARCH_AUTHOR_BY_NAME,
  SEARCH_BOOK_BY_TITLE,
};

export default exported;
