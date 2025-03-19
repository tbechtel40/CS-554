import axios from "axios";
import helpers from "../helpers.js";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

const apiURL = "https://pokeapi.co/api/v2/";

async function getPokemonList() {
    const endpoint = `${apiURL}/pokemon`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function getPokemon(pokemonId) {
    pokemonId = helpers.checkPokemonAPIId(pokemonId, "pokemonId");
    const endpoint = `${apiURL}/pokemon/${pokemonId}`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function getMoveList() {
    const endpoint = `${apiURL}/move`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function getMove(moveId) {
    moveId = helpers.checkPokemonAPIId(moveId, "moveId");
    const endpoint = `${apiURL}/move/${moveId}`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function getItemList() {
    const endpoint = `${apiURL}/item`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function getItem(itemId) {
    itemId = helpers.checkPokemonAPIId(itemId, "itemId");
    const endpoint = `${apiURL}/item/${itemId}`;
    let data = await resolveQuery(endpoint);
    return data;
}

async function resolveQuery(url) {
    // Request the result from PokeAPI with a 20 second timeout
    try {
        let { data } = await axios.get(url, { timeout: 20 * 1000 });
        return data;
    } catch (e) {
        throw `${e.name}: ${e.message}`;
    }
}

export default {getPokemon, getPokemonList, getMoveList, getMove, getItemList, getItem};