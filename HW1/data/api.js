import {advancedMovies} from "../config/mongoCollections.js";
import { checkString, checkYear, checkId, checkName, checkMovie } from "../helpers.js";
import { ObjectId } from "mongodb";

export const getMovies = async function(skip, take) {
  if (typeof skip === "undefined") {
    skip = 0;
  }
  if (typeof skip !== "number" || isNaN(skip) || skip < 0 || !Number.isInteger(skip)) throw "If providing skip in the querystring, it must be a positive integer."
  
  if (typeof take === "undefined") {
    if (skip === 0) {
      take = 20;
    } else {
      take = 100;
    }
  }
  if (typeof take !== "number" || isNaN(take) || take <= 0 || take > 100 || !Number.isInteger(take)) throw "If providing take in the querystring, it must be a positive integer no greater than 100."

  const movieCollection = await advancedMovies();
  const movieList = await movieCollection.find({}).skip(skip).limit(take).toArray();
  if (!movieList) throw 'Could not get all movies.';
  return movieList;
}

export const getMovieId = async function (movieId) {
  movieId = checkId(movieId, "movieId");
  const movieCollection = await advancedMovies();
  const movie = await movieCollection.findOne({_id: new ObjectId(movieId)});
  if (movie === null) throw 'No movie with that id';
  return movie;
};

export const newMovie = async function (title, cast, info, plot, rating) {
    title = checkMovie(title, 'title');
    plot = checkString(plot, 'plot');

    if (!rating) throw "You must provide a number > 0 with either zero or one decimal place for the rating.";
    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
    if (!Number.isInteger(rating)) {
      if(rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
    }

    if (!Array.isArray(cast) || cast.length === 0) throw "There must be at least one cast member provided for a movie.";
    for (let castMember of cast) {
      castMember.firstName = checkName(castMember.firstName, 'firstName');
      castMember.lastName = checkName(castMember.lastName, 'lastName');
    }

    if (!info) throw "You must provide an info object about the movie including the director and year released.";
    info.director = checkName(info.director, "Director");
    info.yearReleased = checkYear(info.yearReleased);

    const addMovie = {
      title: title,
      cast: cast,
      info: info,
      plot: plot,
      rating: rating,
      comments: []
    };
    const movieCollection = await advancedMovies();
    const insertInfo = await movieCollection.insertOne(addMovie);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add movie';
  
    const newId = insertInfo.insertedId.toString();
  
    const movie = await getMovieId(newId);
    return movie;
  };

export const updateOldMovie = async function (movieId, title, cast, info, plot, rating) {
  movieId = checkId(movieId, "movieId")

  title = checkMovie(title, 'title');
  plot = checkString(plot, 'plot');

  if (!rating) throw "You must provide a number > 0 with either zero or one decimal place for the rating.";
  if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
  if (!Number.isInteger(rating)) {
    if(rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
  }

  if (!Array.isArray(cast) || cast.length === 0) throw "There must be at least one cast member provided for a movie.";
  for (let castMember of cast) {
    castMember.firstName = checkName(castMember.firstName, 'firstName');
    castMember.lastName = checkName(castMember.lastName, 'lastName');
  }

  if (!info) throw "You must provide an info object about the movie including the director and year released.";
  info.director = checkName(info.director, "Director");
  info.yearReleased = checkYear(info.yearReleased);

  const oldMovie = await getMovieId(movieId);

  const addMovie = {
    title: title,
    cast: cast,
    info: info,
    plot: plot,
    rating: rating,
    comments: oldMovie.comments
  };

  const movieCollection = await advancedMovies();
  const updatedInfo = await movieCollection.findOneAndUpdate(
    {_id: new ObjectId(movieId)},
    {$set: addMovie},
    {returnDocument: "after"});

  if (!updatedInfo) {
    throw 'could not update product successfully';
  }

  return updatedInfo;
}

export const newComment = async function (movieId, name, comment) {
  movieId = checkId(movieId, 'movieId');
  name = checkName(name, 'name');
  comment = checkString(comment, 'comment');

  const newComment = {
      _id: new ObjectId(),
      name: name,
      comment: comment,
  };

  const movieCollection = await advancedMovies();
  const movie = await movieCollection.findOneAndUpdate(
    {_id: new ObjectId(movieId)},
    {$push: {comments: newComment}},
    {returnDocument: "after"});

  if (movie === null) throw 'No movie with that id';

  return movie;
}

export const deleteComment = async function (movieId, commentId) {
  movieId = checkId(movieId, "movieId");
  const checkMovie = await getMovieId(movieId);
  const movieCollection = await advancedMovies();
  const foundComment = await movieCollection.findOne(
    {'comments._id': new ObjectId(commentId)},
    {projection: {_id: 1, 'reviews.$': 1}}
  );
  if (foundComment === null) throw 'No comment with that id';
  await movieCollection.updateOne(
    {_id: foundComment._id},
    {$pull: {comments: {_id: new ObjectId(commentId)}}}
  );

  const updatedMovie = await getMovieId(movieId);
  return updatedMovie;
}


export const updateMoviePatch = async function (movieId, title, cast, info, plot, rating) {
  movieId = checkId(movieId, "movieId")
  const moviePatch = {};

  if (title) {
    title = checkMovie(title, 'title');
    moviePatch["title"] = title;
  }

  if (plot) {
    plot = checkString(plot, 'plot');
    moviePatch["plot"] = plot;
  }

  if (rating) {
    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
    if (!Number.isInteger(rating)) {
      if(rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
    }
    moviePatch["rating"] = rating;
  }

  if (cast) {
    if (!Array.isArray(cast) || cast.length === 0) throw "There must be at least one cast member provided for a movie.";
    for (let castMember of cast) {
      castMember.firstName = checkName(castMember.firstName, 'firstName');
      castMember.lastName = checkName(castMember.lastName, 'lastName');
    }
    moviePatch["cast"] = cast;
  }

  if (info) {
    if (info.director) {
      info.director = checkName(info.director, "Director");
      moviePatch["info.director"] = info.director;
    }
    if (info.yearReleased) {
      info.yearReleased = checkYear(info.yearReleased);
      moviePatch["info.yearReleased"] = info.yearReleased;
    }
  }
  
  const movieCollection = await advancedMovies();
  let updatedInfo = await movieCollection.findOneAndUpdate(
    {_id: new ObjectId(movieId)},
    {$set: moviePatch},
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update product successfully';
  }

  return updatedInfo;
}