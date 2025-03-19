import {ObjectId} from "mongodb";
import {GraphQLError} from 'graphql';

// change error throws so they're GraphQL

let checkId = (id, varName) => {
    try {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.toLowerCase().trim();
        if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
  }

let checkString = (strVal, varName) => {
    try {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        let specialString = strVal.match(/[^a-zA-Z ]/g);
        if(specialString !== null && specialString.length === strVal.length) throw `Error: ${varName} cannot contain only special characters or numbers`
        return strVal;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkName = (strVal, varName) => {
    try {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (strVal.length < 2 || strVal.length > 25) {
            throw `Error: ${varName} must be a string between 2 and 25 characters`;
        }
        let specialString = strVal.match(/[^a-zA-Z ]/g);
        if(specialString !== null) throw `Error: ${varName} cannot contain numbers or special characters`
        return strVal;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
    
}

let isDateValid = (date) => {
    try {
        let year = new Date(date);
        if (year > Date.now()) throw `Error: dateOfBirth must be a date that has already occurred!`;
        return !isNaN(new Date(date));
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkBook = (strVal, varName) => {
    try {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        return strVal;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkYear = (year) => {
    try {
        if (!year) throw `Error: You must supply a establishedYear}!`;
        let currentDate = new Date(Date.now());
        if (typeof year !== "number" || isNaN(year) || year < 1488 || year > currentDate.getFullYear()) throw `Error: establishedYear must be a year between 1488 and the current year!`;
        if (!Number.isInteger(year)) throw `Error: establishedYear must be a year between 1488 and the current year!`;
        return year;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkYearRange = (minYear, maxYear) => {
    try {
        let currentDate = new Date(Date.now());
        if (typeof minYear !== "number" || isNaN(minYear) || typeof maxYear !== "number" || isNaN(maxYear) || minYear <= 0 || maxYear < minYear || maxYear > (currentDate.getFullYear() + 5)) throw `Error: minYear and maxYear must be years where maxYear is not less than minYear!`;
        if (!Number.isInteger(minYear) || !Number.isInteger(maxYear)) throw `Error: minYear and maxYear must be integers`;
        return true;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkLocation = (strVal, varName) => {
    try {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        let specialString = strVal.match(/[^a-zA-Z, ]/g);
        if(specialString !== null) throw `Error: ${varName} cannot contain numbers or special characters`
    
        let address = strVal.split(",");
        if (address.length !== 2) throw `Error: ${varName} must be in the format of \"[City], [State]\"`
        if (address[0].length === 0 || address[1].length === 0) throw `Error: ${varName} must be in the format of \"[City], [State]\"`
        return strVal;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}

let checkChapters = (chapterArray, varName) => {
    try {
        if(!chapterArray) return false;
        if (!Array.isArray(chapterArray)) throw `Error: ${varName} must be an array`;
        if (chapterArray.length === 0) throw `Error: ${varName} must not be an empty array`;
        for (let item of chapterArray) {
            if(typeof item !== "string") throw `Error: ${varName} must contain only strings`;
            item = item.trim();
            if (item.length === 0) throw `Error: ${varName} cannot contain an empty string or string with just spaces`;
        }
        const newArray = chapterArray.map(item =>item.trim());
        return newArray;
    } catch (e) {
        throw new GraphQLError(e, {
            extensions: {code: 'BAD_USER_INPUT'}
        });
    }
}


export default {checkId, checkString, checkName, isDateValid, checkBook, checkYear, checkLocation, checkYearRange, checkChapters};