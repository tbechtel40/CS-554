//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

let checkPokemonAPIId = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    let specialString = strVal.match(/[^a-zA-Z0-9]/g);
    if(specialString !== null) throw `Error: ${varName} cannot contain special characters`
    return strVal;
}

export default {checkPokemonAPIId}