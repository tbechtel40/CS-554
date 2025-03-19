/* eslint-disable react/prop-types */
const SearchAttractions = (props) => {
    const handleChange = (e) => {
      props.searchValue(e.target.value);
    };
    return (
      <form
        method='POST '
        onSubmit={(e) => {
          e.preventDefault();
        }}
        name='formName'
        className='center'
      >
        <label>
          <span>Search Attractions: </span>
          <input
            autoComplete='off'
            type='text'
            name='searchTerm'
            onChange={handleChange}
          />
        </label>
      </form>
    );
  };
  
  export default SearchAttractions;
  