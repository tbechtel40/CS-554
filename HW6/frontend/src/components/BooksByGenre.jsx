/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Link } from "react-router-dom";

function BooksByGenre(props) {
    const {loading, error, data} = useQuery(
        queries.BOOKS_BY_GENRE,
        {
        variables: {genre: props.searchValue.toUpperCase()},
        onError: (error) => {
            console.log(error.message);
        },
        fetchPolicy: 'cache-and-network'
        }
    );
    if (data) {
        console.log(data.booksByGenre)
        if (data.booksByGenre.length === 0) {
            return <h2>No results.</h2>;
        }
        return (
        <div>          
            {data.booksByGenre.map((book) => {
            return (
                <div className='card' key={book._id}>
                <div className='card-body'>
                    <h2 className='card-title'>
                    <Link to={`/books/${book._id}`}>{book.title}</Link>
                    </h2>
                    <h5>
                        {book.publicationDate} <br/>
                        {book.genre}
                    </h5>
                    <br />
                </div>
                </div>
            );
            })}
        </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div className="red">{error.message}</div>;
    }
}

export default BooksByGenre;