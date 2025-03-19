/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Link } from "react-router-dom";

function PublishersByEstablishedYear(props) {
    const {loading, error, data} = useQuery(
        queries.PUBLISHERS_BY_ESTABLISHED_YEAR,
        {
        variables: {min: parseInt(props.searchValue), max: parseInt(props.otherSearchValue)},
        onError: (error) => {
            console.log(error.message);
        },
        fetchPolicy: 'cache-and-network'
        }
    );
    if (data) {
        console.log(data.PublishersByEstablishedYear)
        if (data.publishersByEstablishedYear.length === 0) {
            return <h2>No results.</h2>;
        }
        return (
        <div>          
            {data.publishersByEstablishedYear.map((publisher) => {
            return (
                <div className='card' key={publisher._id}>
                <div className='card-body'>
                    <h2 className='card-title'>
                    <Link to={`/publishers/${publisher._id}`}>{publisher.name}</Link>
                    </h2>
                    <h5>
                        {publisher.location} <br/>
                        {publisher.establishedYear}
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

export default PublishersByEstablishedYear;