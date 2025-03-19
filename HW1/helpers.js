//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

import {ObjectId} from "mongodb";

let errorCheck = (vari) => {
    if (!vari) return false;
    if (typeof vari !== 'string') return false;
    if (vari.trim().length === 0) return false;
    return true;
  };

let checkInput = (strVal, varName, str1, str2) => {
    if (!strVal) return false;
    if (typeof strVal !== 'string') return false;
    strVal = strVal.trim();
    if (strVal.length === 0)
        return false;
    strVal = strVal.toLowerCase();
    if(strVal !== str1 && strVal !== str2)
        return false;
    return true;
}

let parameterCheck = (vari) => {
    if (typeof vari !== 'string') return false;
    if (vari.trim().length === 0) return false;
    return true;
}


let checkString = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    // if (!isNaN(strVal))
    //     throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    let specialString = strVal.match(/[^a-zA-Z ]/g);
    if(specialString.length === strVal.length) throw `Error: ${varName} cannot contain only special characters or numbers`
    return strVal;
}

let checkMovie = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
}

let checkName = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    // if (!isNaN(strVal))
    //     throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    let specialString = strVal.match(/[^a-zA-Z ]/g);
    if(specialString !== null) throw `Error: ${varName} cannot contain numbers or special characters`
    return strVal;
}

let checkYear = (year) => {
    if (!year) throw `Error: You must supply a yearReleased}!`;
    if (typeof year !== "number" || isNaN(year) || year < 1878 || year > 2029) throw `Error: yearReleased must be a year between 1878 and 2029!`;
    if (!Number.isInteger(year)) throw `Error: yearReleased must be a year between 1878 and 2029!`;
    return year;
}

let checkPassword = (strVal) => {
    if (!strVal) return false;
    if (typeof strVal !== 'string') return false;
    strVal = strVal.trim();
    if (strVal.length === 0)
      return false;
    let spaceString = strVal.match(/\s+/);
    if(spaceString !== null) {
        return false;
    }
    if(strVal.length < 8) {
        return false;
    }
    let upperCase = strVal.match(/[A-Z]/g);
    if(upperCase === null) {
        return false;
    }
    let numberString = strVal.match(/[0-9]/g);
    if(numberString === null) {
        return false;
    }
    let specialString = strVal.match(/[^a-zA-Z0-9]/g);
    if(specialString === null) {
        return false;
    }
    return true;
}

const createUser = async (username) => {
    if(!checkString(username, "username", 5, 10)) throw "You must provide a valid username.";
    username = username.trim();
    const usersCollection = await users();
    const user = await usersCollection.findOne({username: username});
    if (user !== null) throw "A user with the given username already exists."
    return user;
}

const findUser = async (username) => {
    if(!checkString(username, "username", 5, 10)) throw "You must provide a valid username.";
    username = username.trim();
    const usersCollection = await users();
    const user = await usersCollection.findOne({username: username}, {_id: 0, firstName: 1, lastName: 1, username: 1, password: 0, favoriteQuote: 1, themePreference: 1, role: 1});
    if (user === null) throw "Either the username or password is invalid";
    return user;
}

 let checkId = (id, varName) => {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  }
  
  let arrayCheck = (vari) => {
      if(!vari) return false;
      if (!Array.isArray(vari)) return false;
      let valid = 0;
      for (let item of vari) {
          if(typeof item !== "string") return false;
          if(item.trim().length === 0) return false;
          valid = 1;
      }
      if(valid !== 1) return false;
      return true;
  }
  
  let trimElements = (array) => {
      return array.map(element => {return element.trim()});
  };
  
  export {errorCheck, checkInput, parameterCheck, checkName, checkString, checkMovie, checkYear, createUser, findUser, checkPassword, checkId, arrayCheck, trimElements}