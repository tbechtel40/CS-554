import apiData from "../data/api.js";
import express from "express";
import helpers from "../helpers.js";
const router = express.Router();
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

router
.get("/pokemon", async (req, res) => {
    try {
      const pokemonList = await apiData.getPokemonList();
      await client.set("pokemonList", JSON.stringify(pokemonList));
      return res.status(200).json(pokemonList);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })

router
.get("/pokemon/history", async (req, res) => {
  try {
    let pokemonHistory = await client.lRange("pokemonHistory", 0, 24);
    pokemonHistory.forEach((pokemon, index) => {
      pokemonHistory[index] = JSON.parse(pokemon);
    })
    return res.status(200).json(pokemonHistory);
  } catch (e) {
    return res.status(500).json({error: e});
  }
})

router
.get("/pokemon/:id", async (req, res) => {
  try {
    req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    const pokemon = await apiData.getPokemon(req.params.id);
    await client.set(`pokemon/${req.params.id}`, JSON.stringify(pokemon));
    await client.lPush("pokemonHistory", JSON.stringify(pokemon));
    return res.status(200).json(pokemon);
  } catch (e) {
    return res.status(404).json({error: "Pokemon with given Id not found in API"});
  }
})

router
.get("/move", async (req, res) => {
  try {
    const moveList = await apiData.getMoveList();
    await client.set("moveList", JSON.stringify(moveList));
    return res.status(200).json(moveList);
  } catch (e) {
    return res.status(500).json({error: e});
  }
})

router
.get("/move/:id", async (req, res) => {
    try {
    req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
  } catch (e) {
    return res.status(400).json({error: e});
  }
  
  try {
    const move = await apiData.getMove(req.params.id);
    await client.set(`move/${req.params.id}`, JSON.stringify(move));
    return res.status(200).json(move);
  } catch (e) {
    return res.status(404).json({error: "Move with given Id not found in API"});
  }
})

router
.get("/item", async (req, res) => {
  try {
    const itemList = await apiData.getItemList();
    await client.set("itemList", JSON.stringify(itemList));
    return res.status(200).json(itemList);
  } catch (e) {
    return res.status(500).json({error: e});
  }
})

router
.get("/item/:id", async (req, res) => {
  try {
    req.params.id = helpers.checkPokemonAPIId(req.params.id, "URL Id");
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    const item = await apiData.getItem(req.params.id);
    await client.set(`item/${req.params.id}`, JSON.stringify(item));
    return res.status(200).json(item);
  } catch (e) {
    return res.status(404).json({error: "Item with given Id not found in API"});
  }
})

export default router;