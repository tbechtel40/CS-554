/* eslint-disable react/prop-types */

import BooksByGenre from "./BooksByGenre";
import BookByTitle from "./BookByTitle";
import AuthorByName from "./AuthorByName";
import PublishersByEstablishedYear from "./PublishersByEstablishedYear";
import { useState } from "react";

const Search = (props) => {
    const [searchValue, setSearchValue] = useState(null);
    const [otherSearchValue, setOtherSearchValue] = useState(null);
    const [searchResult, setSearchResult] = useState("");
    let body = null;
    let secondForm = null;
    let header = null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(document.getElementById("searchValue"));
        setOtherSearchValue(document.getElementById("otherSearchValue"))
        if (props.type === 'publishersByEstablishedYear' && searchValue !== null && otherSearchValue !== null) {
            console.log(otherSearchValue);
            setSearchResult(<PublishersByEstablishedYear searchValue={searchValue.value} otherSearchValue={otherSearchValue.value}/>);
        } else if (props.type === "booksByGenre" && searchValue !== null) {
            setSearchResult(<BooksByGenre searchValue={searchValue.value}/>)
            console.log(searchValue.value);
        } else if (props.type === "authorByName" && searchValue !== null) {
            setSearchResult(<AuthorByName searchValue={searchValue.value}/>)
            console.log(searchValue.value);
        } else if (props.type === "bookByTitle" && searchValue !== null) {
            setSearchResult(<BookByTitle searchValue={searchValue.value}/>)
            console.log(searchValue.value);
        }
    }

    if (props.type === "selectOption") {
        return null;
    }
    
    if (props.type === "publishersByEstablishedYear") {
        header = <h2>Search {props.type} minYear: </h2>
        secondForm = (<form
            method='POST '
            name='formName'
            className='center'
        >
            <label>
            <h2>Search {props.type} maxYear: </h2>
            <input
                id="otherSearchValue"
                autoComplete='off'
                type='text'
                onChange={handleSubmit}
                name='otherSearchValue'
            />
            </label>
            <br/>
            <br/>
        </form>)
    } else {
        header = <h2>Search {props.type}: </h2>
        secondForm = null;
    }
    
    if (searchValue !== null) {
        body = searchResult;
    }

    return (
    <div>
        {body}
        <form
            method='POST '
            name='formName'
            className='center'
        >
            <label>
            {header}
            <input
                id="searchValue"
                autoComplete='off'
                type='text'
                onChange={handleSubmit}
                name='searchValue'
            />
            </label>
            <br/>
            <br/>
        </form>
        {secondForm}
    </div>
    );
  };
  
  export default Search;
  