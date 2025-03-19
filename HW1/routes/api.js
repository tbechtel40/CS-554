import express from "express";
import { checkId, checkYear, checkString, checkMovie, checkName } from "../helpers.js";
import { newMovie, getMovies, getMovieId, updateOldMovie, newComment, deleteComment, updateMoviePatch } from "../data/api.js";

const router = express.Router();

router
  .get("/", async (req, res) => {
    try {
      if (typeof req.query.skip !== "undefined") {
        req.query.skip = Number(req.query.skip);
        if (typeof req.query.skip !== "number" || isNaN(req.query.skip) || req.query.skip <= 0 || !Number.isInteger(req.query.skip)) throw "If providing skip in the querystring, it must be a positive integer."
      }
      
      if (typeof req.query.take !== "undefined") {
        req.query.take = Number(req.query.take);
        if (typeof req.query.take !== "number" || isNaN(req.query.take) || req.query.take <= 0 || req.query.take > 100 || !Number.isInteger(req.query.take)) throw "If providing take in the querystring, it must be a positive integer no greater than 100."
      }
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const movieList = await getMovies(req.query.skip, req.query.take);
      return res.json(movieList);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })
  .post("/", async (req, res) => {
    const movieData = req.body;
    if(!movieData || Object.keys(movieData).length === 0) {
      return res.status(400).json({error: "There are no fields in the body request."})
    }
    try {
      movieData.title = checkMovie(movieData.title, 'title');
      movieData.plot = checkString(movieData.plot, 'plot');

      if (!movieData.rating) throw "You must provide a number > 0 with either zero or one decimal place for the rating.";
      if (typeof movieData.rating !== "number" || isNaN(movieData.rating) || movieData.rating < 0 || movieData.rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
      if (!Number.isInteger(movieData.rating)) {
        if(movieData.rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
      }

      if (!Array.isArray(movieData.cast) || movieData.cast.length === 0) throw "There must be at least one cast member provided for a movie.";
      for (let castMember of movieData.cast) {
        castMember.firstName = checkName(castMember.firstName, 'firstName');
        castMember.lastName = checkName(castMember.lastName, 'lastName');
      }

      if (!movieData.info) throw "You must provide an info object about the movie including the director and year released.";
      movieData.info.director = checkName(movieData.info.director, "Director");
      movieData.info.yearReleased = checkYear(movieData.info.yearReleased);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const {title, cast, info, plot, rating} = movieData;
      const movie = await newMovie(title, cast, info, plot, rating);
      return res.status(200).json(movie);
    } catch (e) {
      return res.status(400).json({error: e});
    }
  })

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = checkId(req.params.id, 'movieId');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const movie = await getMovieId(req.params.id);
      return res.status(200).json(movie);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .put(async (req, res) => {
    const updateMovie = req.body;
    if(!updateMovie || Object.keys(updateMovie).length === 0) {
      return res.status(400).json({error: "There are no fields in the body request."})
    }
    try {
      req.params.id = checkId(req.params.id, 'movieId');
      updateMovie.title = checkMovie(updateMovie.title, 'title');
      updateMovie.plot = checkString(updateMovie.plot, 'plot');

      if (!updateMovie.rating) throw "You must provide a number > 0 with either zero or one decimal place for the rating.";
      if (typeof updateMovie.rating !== "number" || isNaN(updateMovie.rating) || updateMovie.rating < 0 || updateMovie.rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
      if (!Number.isInteger(updateMovie.rating)) {
        if(updateMovie.rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
      }

      if (!Array.isArray(updateMovie.cast) || updateMovie.cast.length === 0) throw "There must be at least one cast member provided for a movie.";
      for (let castMember of updateMovie.cast) {
        castMember.firstName = checkName(castMember.firstName, 'firstName');
        castMember.lastName = checkName(castMember.lastName, 'lastName');
      }

      if (!updateMovie.info) throw "You must provide an info object about the movie including the director and year released.";
      updateMovie.info.director = checkName(updateMovie.info.director, "Director");
      updateMovie.info.yearReleased = checkYear(updateMovie.info.yearReleased);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const updatedMovie = await updateOldMovie(req.params.id, updateMovie.title, updateMovie.cast, updateMovie.info, updateMovie.plot, updateMovie.rating);
      return res.json(updatedMovie);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .patch(async (req, res) => {
    const updateMovie = req.body;
    if(!updateMovie || Object.keys(updateMovie).length === 0) {
      return res.status(400).json({error: "There are no fields in the body request."})
    }
    try {
      req.params.id = checkId(req.params.id, 'movieId');
      if (updateMovie.title) {
        updateMovie.title = checkMovie(updateMovie.title, 'title');
      }
      if (updateMovie.plot) {
        updateMovie.plot = checkString(updateMovie.plot, 'plot');
      }

      if (updateMovie.rating) {
        if (typeof updateMovie.rating !== "number" || isNaN(updateMovie.rating) || updateMovie.rating < 0 || updateMovie.rating > 5) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
        if (!Number.isInteger(updateMovie.rating)) {
          if(updateMovie.rating.toString().split(".")[1].length > 1) throw "You must provide a number between 0 and 5 with either zero or one decimal place for the rating.";
        }
      }

      if (updateMovie.cast) {
        if (!Array.isArray(updateMovie.cast) || updateMovie.cast.length === 0) throw "There must be at least one cast member provided for a movie.";
        for (let castMember of updateMovie.cast) {
          castMember.firstName = checkName(castMember.firstName, 'firstName');
          castMember.lastName = checkName(castMember.lastName, 'lastName');
        }  
      }
      
      if (updateMovie.info) {
        if(updateMovie.info.director) {
          updateMovie.info.director = checkName(updateMovie.info.director, "Director");
        }
        if (updateMovie.info.yearReleased) {
          updateMovie.info.yearReleased = checkYear(updateMovie.info.yearReleased);
        }
      }
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const updatedMovie = await updateMoviePatch(req.params.id, updateMovie.title, updateMovie.cast, updateMovie.info, updateMovie.plot, updateMovie.rating);
      return res.json(updatedMovie);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })

router
  .route('/:id/comments')
  .post(async (req, res) => {
    const movieData = req.body;
    if(!movieData || Object.keys(movieData).length === 0) {
      return res.status(400).json({error: "There are no fields in the body request."})
    }
    try {
      req.params.id = checkId(req.params.id, 'movieId');
      movieData.name = checkName(movieData.name, 'name');
      movieData.comment = checkString(movieData.comment, 'comment');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const movie = await getMovieId(req.params.id);
      const movieWithComment = await newComment(req.params.id, movieData.name, movieData.comment);
      return res.status(200).json(movieWithComment);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })

router
  .route('/:movieId/:commentId')
  .delete(async (req, res) => {
    try {
      req.params.movieId = checkId(req.params.movieId, 'movieId');
      req.params.commentId = checkId(req.params.commentId, 'commentId');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let deletedComment = await deleteComment(req.params.movieId, req.params.commentId);
      return res.status(200).json(deletedComment);
    } catch (e) {
      return res.status(404).json({error: e})
    }
  })

export default router;