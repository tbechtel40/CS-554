import {GraphQLError} from 'graphql';

import {bookCollection, publisherCollection, authorCollection} from './config/mongoCollections.js';

import { ObjectId } from 'mongodb';
import helpers from './helpers.js';

import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {
  Query: {
    authors: async (_, args) => {
        let exists = await client.exists("authorList");
        if (exists) {
          console.log('Author list in cache');
          try {
            let authorList = await client.get("authorList");
            console.log('Sending JSON from Redis....');
            return JSON.parse(authorList);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const authors = await authorCollection();
          const allAuthors = await authors.find({}).toArray();
          if (!allAuthors) {
              throw new GraphQLError(`Internal Server Error`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
          }

          // cache result using redis 1 hour
          await client.setEx("authorList", 3600, JSON.stringify(allAuthors));

          return allAuthors;
        }
    },

    books: async (_, args) => {
        let exists = await client.exists("bookList");
        if (exists) {
          console.log('Book list in cache');
          try {
            let bookList = await client.get("bookList");
            console.log('Sending JSON from Redis....');
            return JSON.parse(bookList);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const books = await bookCollection();
          const allBooks = await books.find({}).toArray();
          if (!allBooks) {
              throw new GraphQLError(`Internal Server Error`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
          }

          // cache result using redis 1 hour
          await client.setEx("bookList", 3600, JSON.stringify(allBooks));

          return allBooks;
        }
        
    },

    publishers: async (_, args) => {
        let exists = await client.exists("publisherList");
        if (exists) {
          console.log('Publisher list in cache');
          try {
            let publisherList = await client.get("publisherList");
            console.log('Sending JSON from Redis....');
            return JSON.parse(publisherList);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const publishers = await publisherCollection();
          const allPublishers = await publishers.find({}).toArray();
          if (!allPublishers) {
              throw new GraphQLError(`Internal Server Error`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
              });
          }

          // cache result using redis 1 hour
          await client.setEx("publisherList", 3600, JSON.stringify(allPublishers));

          return allPublishers;
        }
    },

    getAuthorById: async (_, args) => {
        // type check id
        args._id = helpers.checkId(args._id, "AuthorId");

        let exists = await client.exists("author:" + args._id);
        if (exists) {
          console.log('Author in cache');
          try {
            let author = await client.get("author:" + args._id);
            console.log('Sending JSON from Redis....');
            return JSON.parse(author);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const authors = await authorCollection();
          const author = await authors.findOne({_id: new ObjectId(args._id)});
          if (!author) {
              //can't find the author
              throw new GraphQLError('Author Not Found', {
                extensions: {code: 'NOT_FOUND'}
              });
          }

          // cache result using redis (use id as key) no expiration time
          await client.set("author:" + args._id, JSON.stringify(author));

          return author;
        }
    },

    getBookById: async (_, args) => {
        // type check id
        args._id = helpers.checkId(args._id, "BookId");

        let exists = await client.exists("book:" + args._id);
        if (exists) {
          console.log('Book in cache');
          try {
            let book = await client.get("book:" + args._id);
            console.log('Sending JSON from Redis....');
            return JSON.parse(book);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const books = await bookCollection();
          const book = await books.findOne({_id: new ObjectId(args._id)});
          if (!book) {
              //can't find the book
              throw new GraphQLError('Book Not Found', {
              extensions: {code: 'NOT_FOUND'}
              });
          }

          // cache result using redis (use id as key) no expiration time
          await client.set("book:" + args._id, JSON.stringify(book));

          return book;

        }
    },

    getPublisherById: async (_, args) => {
        // type check id
        args._id = helpers.checkId(args._id, "PublisherId");

        let exists = await client.exists("publisher:" + args._id);
        if (exists) {
          console.log('Publisher in cache');
          try {
            let publisher = await client.get("publisher:" + args._id);
            console.log('Sending JSON from Redis....');
            return JSON.parse(publisher);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } 

        const publishers = await publisherCollection();
        const publisher = await publishers.findOne({_id: new ObjectId(args._id)});
        if (!publisher) {
            //can't find the publisher
            throw new GraphQLError('Publisher Not Found', {
            extensions: {code: 'NOT_FOUND'}
            });
        }

        // cache result using redis (use id as key) no expiration time
        await client.set("publisher:" + args._id, JSON.stringify(publisher));

        return publisher;
    },

    getChaptersByBookId: async (_, args) => {
        // type check id
        args.bookId = helpers.checkId(args.bookId, "BookId");
        let exists = await client.exists("book:chapters:" + args.bookId);
        if (exists) {
          console.log('Chapter for book in cache');
          try {
            let bookChapters = await client.get("book:chapters:" + args.bookId);
            console.log('Sending JSON from Redis....');
            return JSON.parse(bookChapters);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const books = await bookCollection();
          const book = await books.findOne({_id: new ObjectId(args.bookId)});
          
          if (!book) {
              //can't find the book
              throw new GraphQLError('Book Not Found', {
              extensions: {code: 'NOT_FOUND'}
              });
          }

          // cache result using redis 1 hour
          await client.set("book:chapters:" + args.bookId, JSON.stringify(book.chapters));

          return book.chapters;
        }
    },

    booksByGenre: async (_, args) => {
        args.genre = args.genre.toLowerCase();    
        let exists = await client.exists("genre:" + args.genre);
        if (exists) {
          console.log('Books for genre in cache');
          try {
            let genreBooks = await client.get("genre:" + args.genre);
            console.log('Sending JSON from Redis....');
            return JSON.parse(genreBooks);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const books = await bookCollection();
          const bookList = await books.find({genre: args.genre}).toArray();

          if (!bookList) {
            //can't find the book genre
            throw new GraphQLError('Book with given genre Not Found', {
              extensions: {code: 'NOT_FOUND'}
            });
          }

          // cache result using redis 1 hour
          await client.setEx("genre:" + args.genre, 3600, JSON.stringify(bookList));

          return bookList;
        }
    },

    publishersByEstablishedYear: async (_, args) => {
        if(!helpers.checkYearRange(args.min, args.max)) {
          throw new GraphQLError('minYear and/or maxYear inputs are invalid', {
            extensions: {code: 'BAD_USER_INPUT'}
          });
        }

        let exists = await client.exists("foundedYear:" + args.min + ":" + args.max);
        if (exists) {
          console.log('Founded year in cache');
          try {
            let foundedYear = await client.get("foundedYear:" + args.min + ":" + args.max);
            console.log('Sending JSON from Redis....');
            return JSON.parse(foundedYear);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const publishers = await publisherCollection();
          const publisherYearList = await publishers.find({establishedYear: {$lte: args.max, $gte: args.min}}).toArray();
          if (!publisherYearList) {
              //can't find the publishers established in that range
              throw new GraphQLError('Publishers established in that range Not Found', {
                extensions: {code: 'NOT_FOUND'}
              });
          }

          console.log(publisherYearList);
          // cache result using redis 1 hour
          await client.setEx("foundedYear:" + args.min + ":" + args.max, 3600, JSON.stringify(publisherYearList));

          return publisherYearList;
        }
    },

    searchAuthorByName: async (_, args) => {
        args.searchTerm = helpers.checkName(args.searchTerm).toLowerCase();

        let exists = await client.exists("search:author:" + args.searchTerm);
        if (exists) {
          console.log('Author search in cache');
          try {
            let authorSearch = await client.get("search:author:" + args.searchTerm);
            console.log('Sending JSON from Redis....');
            return JSON.parse(authorSearch);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const authors = await authorCollection();
          const authorsByName = await authors.find({name: {$regex: args.searchTerm, $options: "i"}}).toArray();

          if (!authorsByName) {
            //can't find the substring
            throw new GraphQLError('Author with given search term Not Found', {
              extensions: {code: 'NOT_FOUND'}
            });
          }

          // cache result using redis 1 hour
          await client.setEx("search:author:" + args.searchTerm, 3600, JSON.stringify(authorsByName));

          return authorsByName;
        }
    },

    searchBookByTitle: async (_, args) => {
        args.searchTerm = helpers.checkBook(args.searchTerm, "Book title").toLowerCase();

        let exists = await client.exists("search:book:" + args.searchTerm);
        if (exists) {
          console.log('Book search in cache');
          try {
            let bookSearch = await client.get("search:book:" + args.searchTerm);
            console.log('Sending JSON from Redis....');
            return JSON.parse(bookSearch);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          const books = await bookCollection();
          const booksByTitle = await books.find({title: {$regex: args.searchTerm, $options: "i"}}).toArray();

          if (!booksByTitle) {
            //can't find the substring
            throw new GraphQLError('Book with given search term Not Found', {
              extensions: {code: 'NOT_FOUND'}
            });
          }

          // cache result using redis 1 hour
          await client.setEx("search:book:" + args.searchTerm, 3600, JSON.stringify(booksByTitle));

          return booksByTitle;
        }
    },
  },

  Book: {
    author: async (parentValue) => {
        const authors = await authorCollection();
        const author = await authors.findOne({_id: new ObjectId(parentValue.authorId)});
        if (!author) {
          throw new GraphQLError(`AuthorId of Book not found`, {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        return author;
    },
    publisher: async (parentValue) => {
      const publishers = await publisherCollection();
      const publisher = await publishers.findOne({_id: new ObjectId(parentValue.publisherId)});
      if (!publisher) {
        throw new GraphQLError(`PublisherId of Book not found`, {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return publisher;
    },
  },

  Author: {
    books: async (parentValue) => {
        const books = await bookCollection();
        const authors = await authorCollection();
        const authorBooks = await books.find({authorId: new ObjectId(parentValue._id)}).toArray();
        if (!authorBooks) {
          throw new GraphQLError(`Could not find Books for Author`, {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        
        return authorBooks;
    },
    numOfBooks: async (parentValue) => {
        const books = await bookCollection();
        const authorBooks = await books.find({authorId: new ObjectId(parentValue._id)}).toArray();
        if (!authorBooks) {
          throw new GraphQLError(`Could not find Books for Author`, {
            extensions: {code: 'NOT_FOUND'}
          });
        }
        return authorBooks.length;
    }
  },

  Publisher: {
    books: async (parentValue) => {
        const books = await bookCollection();
        const publishers = await publisherCollection();
        const publisherBooks = await books.find({publisherId: new ObjectId(parentValue._id)}).toArray();
        if (!publisherBooks) {
          throw new GraphQLError(`Could not find Books for Publisher`, {
            extensions: {code: 'NOT_FOUND'}
          });
        }

        return publisherBooks;
    },
    numOfBooks: async (parentValue) => {
      const books = await bookCollection();
      const authorBooks = await books.find({publisherId: new ObjectId(parentValue._id)}).toArray();
      if (!authorBooks) {
        throw new GraphQLError(`Could not find Books for Publisher`, {
          extensions: {code: 'NOT_FOUND'}
        });
      }
      return authorBooks.length;
  }
  },

  Mutation: {
    addAuthor: async(_, args) => {
        const authors = await authorCollection();

        // type check args
        args.name = helpers.checkName(args.name, "name");
        if (typeof args.bio !== "undefined") {
          args.bio = helpers.checkString(args.bio, "bio");
        } else {
          args.bio = "";
        }
        if (!helpers.isDateValid(args.dateOfBirth) || args.dateOfBirth.charAt(2) !== "/") {
          throw new GraphQLError(`Date of Birth input is not in MM/DD/YYYY format`, {
            extensions: {code: 'BAD_USER_INPUT'}
          })
        }

        const newAuthor = {
            _id: new ObjectId(),
            name: args.name,
            bio: args.bio,
            dateOfBirth: args.dateOfBirth,
            books: []
        };

        let insertedAuthor = await authors.insertOne(newAuthor);
        if (!insertedAuthor.acknowledged || !insertedAuthor.insertedId) {
            throw new GraphQLError(`Could not Add Author`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }

        // add to redis cache
        await client.set("author:" + newAuthor._id.toString().toLowerCase(), JSON.stringify(newAuthor));
        await client.del("authorList");
        let searchTerms = await client.keys("search:author:*");

        for (let key of searchTerms) {
          await client.del(key);
        }

        return newAuthor;
    },

    editAuthor: async (_, args) => {
        args._id = helpers.checkId(args._id, "AuthorId");
        const authors = await authorCollection();
        let newAuthor = await authors.findOne({_id: new ObjectId(args._id)});
        console.log(newAuthor);
        if (newAuthor) {
          if (!args.name && !args.bio && !args.dateOfBirth) {
            throw new GraphQLError(`editAuthor must modify at least one field`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }
          if (args.name) {
            args.name = helpers.checkName(args.name, "name");
            newAuthor.name = args.name;
          }
          if (args.bio) {
            args.bio = helpers.checkString(args.bio, "bio");
            newAuthor.bio = args.bio;
          }
          if (args.dateOfBirth) {
            if (!helpers.isDateValid(args.dateOfBirth) || args.dateOfBirth.charAt(2) !== "/") {
              throw new GraphQLError(`Date of Birth input is not in MM/DD/YYYY format`, {
                extensions: {code: 'BAD_USER_INPUT'}
              })
            }
            newAuthor.dateOfBirth = args.dateOfBirth;
          }
          const author = await authors.updateOne({_id: new ObjectId(args._id)}, {$set: newAuthor});
          if (!author.acknowledged) {
            throw new GraphQLError(`Could not Add Author`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          throw new GraphQLError(
            `Could not update author with _id of ${args._id}`,
            {
              extensions: {code: 'NOT_FOUND'}
            }
          );
        }

        // update redis cache
        await client.set("author:" + newAuthor._id.toString().toLowerCase(), JSON.stringify(newAuthor));
        await client.del("authorList");

        if (args.name) {
          let searchTerms = await client.keys("search:author:*");

          for (let key of searchTerms) {
            await client.del(key);
          }
        }

        return newAuthor;
      },

    removeAuthor: async (_, args) => {
        args._id = helpers.checkId(args._id, "AuthorId");
        const authors = await authorCollection();
        const books = await bookCollection();

        const listBooks = await books.find({authorId: new ObjectId(args._id)}).toArray();
        for (let book of listBooks) {
          await client.del("book:" + book._id); // getBookById
          await client.del("book:chapters:" + book._id); // getChaptersByBookId
          await client.del("publisher:" + book.publisherId._id); // getPublisherById
        }

        const deletedBooks = await books.deleteMany({authorId: new ObjectId(args._id)});
        if (!deletedBooks) {
          throw new GraphQLError(
              `Could not delete books with authorId of ${args._id}`,
              {
                extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        const deletedAuthor = await authors.findOneAndDelete({_id: new ObjectId(args._id)});
        if (!deletedAuthor) {
          throw new GraphQLError(
              `Could not delete author with _id of ${args._id}`,
              {
                extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        await client.del("author:" + args._id); // getAuthorById
        await client.del("authorList"); // authors
        await client.del("bookList"); // books
        await client.del("publisherList"); // publishers
        
        let searchAuthor = await client.keys("search:author:*"); // searchAuthorByName

        for (let key of searchAuthor) {
          await client.del(key);
        }

        let searchBook = await client.keys("search:book:*"); // searchBookByTitle
        for (let key of searchBook) {
          await client.del(key);
        }

        let searchGenre = await client.keys("genre:*"); // booksByGenre
        for (let key of searchGenre) {
          await client.del(key);
        }

        let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
        for (let key of searchEstablishedYear) {
          await client.del(key);
        }

        return deletedAuthor;
    },

    addPublisher: async(_, args) => {
        const publishers = await publisherCollection();

        // type check args
        args.name = helpers.checkName(args.name, "name");
        args.establishedYear = helpers.checkYear(args.establishedYear);
        args.location = helpers.checkLocation(args.location, "Location");

        const newPublisher = {
          _id: new ObjectId(),
          name: args.name,
          establishedYear: args.establishedYear,
          location: args.location,
          books: []
        };

        let insertedPublisher = await publishers.insertOne(newPublisher);
        if (!insertedPublisher.acknowledged || !insertedPublisher.insertedId) {
          throw new GraphQLError(`Could not Add Publisher`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }

        // add to redis cache
        await client.set("publisher:" + newPublisher._id.toString().toLowerCase(), JSON.stringify(newPublisher));
        await client.del("publisherList");
        let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
        for (let key of searchEstablishedYear) {
          await client.del(key);
        }
          
        return newPublisher;
    },

    editPublisher: async (_, args) => {
        args._id = helpers.checkId(args._id, "PublisherId");
        const publishers = await publisherCollection();
        let newPublisher = await publishers.findOne({_id: new ObjectId(args._id)});
        console.log(newPublisher);
        if (newPublisher) {
          if (!args.name && !args.establishedYear && !args.location) {
            throw new GraphQLError(`editPublisher must modify at least one field`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }
          if (args.name) {
            args.name = helpers.checkName(args.name, "name");
            newPublisher.name = args.name;
          }
          if (args.establishedYear) {
            args.establishedYear = helpers.checkYear(args.establishedYear);
            newPublisher.establishedYear = args.establishedYear;
          }
          if (args.location) {
            args.location = helpers.checkLocation(args.location);
            newPublisher.location = args.location;
          }
          const publisher = await publishers.updateOne({_id: new ObjectId(args._id)}, {$set: newPublisher});
          if (!publisher.acknowledged) {
            throw new GraphQLError(`Could not Add Publisher`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          throw new GraphQLError(
            `Could not update publisher with _id of ${args._id}`,
            {
              extensions: {code: 'NOT_FOUND'}
            }
          );
        }

        // update redis cache
        await client.set("publisher:" + newPublisher._id.toString().toLowerCase(), JSON.stringify(newPublisher));
        await client.del("publisherList");
        if (args.establishedYear) {
          let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
          for (let key of searchEstablishedYear) {
            await client.del(key);
          }
        }

        return newPublisher;
      },

    removePublisher: async (_, args) => {
        args._id = helpers.checkId(args._id, "PublisherId");
        const publishers = await publisherCollection();
        const books = await bookCollection();

        const listBooks = await books.find({publisherId: new ObjectId(args._id)}).toArray();
        for (let book of listBooks) {
          await client.del("book:" + book._id); // getBookById
          await client.del("book:chapters:" + book._id); // getChaptersByBookId
          await client.del("author:" + book.authorId._id); // getAuthorById
        }

        const deletedBooks = await books.deleteMany({publisherId: new ObjectId(args._id)});
        if (!deletedBooks) {
          throw new GraphQLError(
              `Could not delete books with authorId of ${args._id}`,
              {
                extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        const deletedPublisher = await publishers.findOneAndDelete({_id: new ObjectId(args._id)});

        if (!deletedPublisher) {
          throw new GraphQLError(
              `Could not delete publisher with _id of ${args._id}`,
              {
              extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        await client.del("publisher:" + args._id);
        await client.del("publisherList");
        await client.del("bookList");
        await client.del("authorList");
        
        let searchAuthor = await client.keys("search:author:*"); // searchAuthorByName

        for (let key of searchAuthor) {
          await client.del(key);
        }

        let searchBook = await client.keys("search:book:*"); // searchBookByTitle
        for (let key of searchBook) {
          await client.del(key);
        }

        let searchGenre = await client.keys("genre:*"); // booksByGenre
        for (let key of searchGenre) {
          await client.del(key);
        }

        let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
        for (let key of searchEstablishedYear) {
          await client.del(key);
        }

        return deletedPublisher;
    },

    addBook: async(_, args) => {
        const books = await bookCollection();

        // type check args
        args.title = helpers.checkBook(args.title, "title");
        if (!helpers.isDateValid(args.publicationDate) || args.publicationDate.charAt(2) !== "/") {
          throw new GraphQLError(`publicationDate input is not in MM/DD/YYYY format`, {
            extensions: {code: 'BAD_USER_INPUT'}
          })
        }

        if (!args.genre) {
          throw new GraphQLError(`Genre not provided`, {extensions: {code: "BAD_USER_INPUT"}});
        }

        args.chapters = helpers.checkChapters(args.chapters, "chapters");
        args.authorId = helpers.checkId(args.authorId, "AuthorId");
        args.publisherId = helpers.checkId(args.publisherId, "PublisherId");

        const authors = await authorCollection();
        const publishers = await publisherCollection();
        let author = await authors.findOne({_id: new ObjectId(args.authorId)});
        if (!author) {
            throw new GraphQLError(`Could not find Author with an ID of ${args.authorId}`, {extensions: {code: "NOT_FOUND"}});
        }

        let publisher = await publishers.findOne({_id: new ObjectId(args.publisherId)});
        if (!publisher) {
            throw new GraphQLError(`Could not find Publisher with an ID of ${args.publisherId}`, {extensions: {code: "NOT_FOUND"}});
        }

        const newBook = {
            _id: new ObjectId(),
            title: args.title,
            publicationDate: args.publicationDate,
            genre: args.genre,
            authorId: new ObjectId(args.authorId),
            publisherId: new ObjectId(args.publisherId),
            chapters: args.chapters
        };

        let insertedBook = await books.insertOne(newBook);
        if (!insertedBook.acknowledged || !insertedBook.insertedId) {
            throw new GraphQLError(`Could not Add Book`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
        }

        const publisherBooks = await publishers.findOneAndUpdate({_id: new ObjectId(args.publisherId)}, {$push: {books: newBook._id}});
        if (!publisherBooks) {
          throw new GraphQLError(`Could not Add Book to Publisher`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }

        const authorBooks = await authors.findOneAndUpdate({_id: new ObjectId(args.authorId)}, {$push: {books: newBook._id}});
        if (!authorBooks) {
          throw new GraphQLError(`Could not Add Book to Author`, {
            extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
        }

        await client.set("book:" + newBook._id.toString().toLowerCase(), JSON.stringify(newBook));
        await client.del("bookList");
        await client.del("authorList");
        await client.del("publisherList");
        await client.del("author:" + args.authorId);
        await client.del("publisher:" + args.publisherId);
        await client.del("genre:" + args.genre);

        // established years
        let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
        for (let key of searchEstablishedYear) {
          await client.del(key);
        }

        // search author by name
        let searchTerms = await client.keys("search:author:*");

        for (let key of searchTerms) {
          await client.del(key);
        }
        
        // search book by title
        let searchBook = await client.keys("search:book:*"); // searchBookByTitle
        for (let key of searchBook) {
          await client.del(key);
        }

        return newBook;
    },

    editBook: async (_, args) => {
        args._id = helpers.checkId(args._id, "PublisherId");
        const books = await bookCollection();
        let newBook = await books.findOne({_id: new ObjectId(args._id)});
        console.log(newBook);

        if (newBook) {
          if (!args.title && !args.publicationDate && !args.genre && !args.chapters && !args.authorId && !args.publisherId) {
            throw new GraphQLError(`editBook must modify at least one field`, {
              extensions: {code: 'BAD_USER_INPUT'}
            })
          }
          if (args.title) {
            args.title = helpers.checkBook(args.title, "title");
            newBook.title = args.title;
          }
          if (args.publicationDate) {
            if (!helpers.isDateValid(args.publicationDate) || args.publicationDate.charAt(2) !== "/") {
              throw new GraphQLError(`publicationDate input is not in MM/DD/YYYY format`, {
                extensions: {code: 'BAD_USER_INPUT'}
              })
            }
            newBook.publicationDate = args.publicationDate;
          }
          if (args.genre) {
            await client.del("genre:" + newBook.genre);
            newBook.genre = args.genre.toLowerCase()
          }
          if (args.chapters) {
            args.chapters = helpers.checkChapters(args.chapters, "chapters");
            newBook.chapters = args.chapters;
          }
          if (args.authorId) {
            args.authorId = helpers.checkId(args.authorId, "AuthorId");
            const authors = await authorCollection();
            let author = await authors.findOne({_id: new ObjectId(args.authorId)});
            if (!author) {
                throw new GraphQLError(`Could not find Author with an ID of ${args.authorId}`, {extensions: {code: "NOT_FOUND"}});
            }
            await client.del("author:" + newBook.authorId);
            newBook.authorId = new ObjectId(args.authorId);
          }
          if (args.publisherId) {
            args.publisherId = helpers.checkId(args.publisherId, "PublisherId");
            const publishers = await publisherCollection();
            let publisher = await publishers.findOne({_id: new ObjectId(args.publisherId)});
            if (!publisher) {
                throw new GraphQLError(`Could not find Publisher with an ID of ${args.publisherId}`, {extensions: {code: "NOT_FOUND"}});
            }
            await client.del("publisher:" + newBook.publisherId);
            newBook.publisherId = new ObjectId(args.publisherId);
          }          
          const book = await books.updateOne({_id: new ObjectId(args._id)}, {$set: newBook});
          if (!book.acknowledged) {
            throw new GraphQLError(`Could not Add Publisher`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
            });
          }
        } else {
          throw new GraphQLError(
            `Could not update book with _id of ${args._id}`,
            {
              extensions: {code: 'NOT_FOUND'}
            }
          );
        }

        // update redis cache
        await client.set("book:" + newBook._id.toString().toLowerCase(), JSON.stringify(newBook));
        await client.del("bookList");
        await client.del("authorList");
        await client.del("publisherList");
        await client.del("author:" + args.authorId);
        await client.del("publisher:" + args.publisherId);
        await client.del("genre:" + args.genre);
        await client.del("book:chapters:" + args._id);

        // established years
        let searchEstablishedYear = await client.keys("foundedYear:*"); // publishersByEstablishedYear
        for (let key of searchEstablishedYear) {
          await client.del(key);
        }

        // search author by name
        let searchTerms = await client.keys("search:author:*");

        for (let key of searchTerms) {
          await client.del(key);
        }
        
        // search book by title
        let searchBook = await client.keys("search:book:*"); // searchBookByTitle
        for (let key of searchBook) {
          await client.del(key);
        }

        return newBook;
      },

    removeBook: async (_, args) => {
        args._id = helpers.checkId(args._id, "BookId");
        const books = await bookCollection();
        const authors = await authorCollection();
        const publishers = await publisherCollection();

        const updateAuthor = await authors.updateMany({books: new ObjectId(args._id)}, {$pull: {books: new ObjectId(args._id)}});
        if (!updateAuthor) {
          throw new GraphQLError(
              `Could not delete book with _id of ${args._id} from authors`,
              {
                extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        const updatePublisher = await publishers.updateMany({books: new ObjectId(args._id)}, {$pull: {books: new ObjectId(args._id)}});
        if (!updatePublisher) {
          throw new GraphQLError(
              `Could not delete book with _id of ${args._id} from publishers`,
              {
                extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        const deletedBook = await books.findOneAndDelete({_id: new ObjectId(args._id)});
        if (!deletedBook) {
          throw new GraphQLError(
              `Could not delete book with _id of ${args._id}`,
              {
              extensions: {code: 'NOT_FOUND'}
              }
          );
        }

        await client.flushDb();

        return deletedBook;
    }
  }
};
