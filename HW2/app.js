import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
const staticDir = express.static("public");
import redis from "redis";
import helpers from "./helpers.js";
const client = redis.createClient();
client.connect().then(() => {});

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware 1
app.use("/api/pokemon", async (req, res, next) => {
  if (req.originalUrl === "/api/pokemon" || req.originalUrl === "/api/pokemon/") {
  let exists = await client.exists("pokemonList");
    if (exists) {
      console.log('Pokemon list in cache');
      try {
        let pokemonList = await client.get("pokemonList");
        console.log('Sending JSON from Redis....');
        return res.status(200).json(JSON.parse(pokemonList));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})


// mideleware 2
app.use("/api/pokemon/:id", async (req, res, next) => {
  if (req.originalUrl.indexOf('/api/pokemon') === 0 && typeof req.params.id !== "undefined" && req.originalUrl !== "/api/pokemon/history") {
    try {
      req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
    } catch (e) {
      return res.status(400).json({error: e});
    }
    let exists = await client.exists("pokemon/" + req.params.id);
    if (exists) {
      console.log('Pokemon in cache');
      try {
        let pokemon = await client.get("pokemon/" + req.params.id);
        console.log('Sending JSON from Redis....');
        await client.lPush("pokemonHistory", pokemon);
        return res.status(200).json(JSON.parse(pokemon));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})


// mideleware 3
app.use("/api/move", async (req, res, next) => {
  if (req.originalUrl === "/api/move" || req.originalUrl === "/api/move/") {
    let exists = await client.exists("moveList");
    if (exists) {
      console.log('Move list in cache');
      try {
        let moveList = await client.get("moveList");
        console.log('Sending JSON from Redis....');
        return res.status(200).json(JSON.parse(moveList));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

// mideleware 4
app.use("/api/move/:id", async (req, res, next) => {
  if (req.originalUrl.indexOf('/api/move') === 0 && typeof req.params.id !== "undefined") {
    try {
      req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
    } catch (e) {
      return res.status(400).json({error: e});
    }
    let exists = await client.exists("move/" + req.params.id);
    if (exists) {
      console.log('Move in cache');
      try {
        let move = await client.get("move/" + req.params.id);
        console.log('Sending JSON from Redis....');
        return res.status(200).json(JSON.parse(move));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

// mideleware 5
app.use("/api/item", async (req, res, next) => {
  if (req.originalUrl === "/api/item" || req.originalUrl === "/api/item/") {
    let exists = await client.exists("itemList");
    if (exists) {
      console.log('Item list in cache');
      try {
        let itemList = await client.get("itemList");
        console.log('Sending JSON from Redis....');
        return res.status(200).json(JSON.parse(itemList));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

// mideleware 6
app.use("/api/item/:id", async (req, res, next) => {
  if (req.originalUrl.indexOf('/api/item') === 0 && typeof req.params.id !== "undefined") {
    try {
      req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
    } catch (e) {
      return res.status(400).json({error: e});
    }
    let exists = await client.exists("item/" + req.params.id);
    if (exists) {
      console.log('Item in cache');
      try {
        let item = await client.get("item/" + req.params.id);
        console.log('Sending JSON from Redis....');
        return res.status(200).json(JSON.parse(item));
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000\n");
});
