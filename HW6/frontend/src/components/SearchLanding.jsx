import '../App.css';
//Import the file where my query constants are defined
import { useState } from 'react';
import Search from "./Search";

function SearchLanding() {
    const [searchBox, setSearchBox] = useState(null);

    const handleChange = (e) => {
        setSearchBox(<Search type={e.target.value} />);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

  return (
  <div>
    {searchBox}
    <h1>What would you like to search for?</h1>
    <form onSubmit={handleSubmit}>
        <label>
            Select your option using the dropdown below
            <br/>
            <select onChange={handleChange}>
                <option value="selectOption">-</option>
                <option value="booksByGenre">Books by Genre</option>
                <option value="publishersByEstablishedYear">Publishers by Established Year</option>
                <option value="authorByName">Author by Name</option>
                <option value="bookByTitle">Book by Title</option>
            </select>
        </label>
        <br/>
        <br/>
    </form>
  </div>
  );
}

export default SearchLanding;
