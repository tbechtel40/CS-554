// ROUTE /events/page/:page

// /discovery/v2/events


// ROUTE /events/:id

// /discovery/v2/events/{id}

import {useState, useEffect} from 'react';
import axios from 'axios';
import noImage from '../img/download.jpeg';
import {
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Typography
  } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import ErrorCard from "./ErrorCard";

const apiKey = import.meta.env.VITE_TICKETMASTER_KEY;

const baseURL = `https://app.ticketmaster.com/discovery/v2/venues/`;

const VenueCard = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(undefined);
  let {id} = useParams();
  
  useEffect(() => {
    console.log('search useEffect fired');
    console.log("Venue Id: " + id);
    async function fetchData() {
      try {
        console.log(`in fetch Venue Id: ${id}`);
        const {data} = await axios.get(baseURL + id + `/?apikey=${apiKey}&countryCode=US`);
        console.log(baseURL);
        setPageData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    if (id) {
      console.log('Venue Id is set');
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }

  if(id && pageData) {
    let venue = pageData;
    return (<Card
    variant='outlined'
    sx={{
      maxWidth: 550,
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 5,
      border: '4px solid #1e8678',
      boxShadow:
        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    }}
  >
    <CardHeader
      title={venue.name}
      sx={{
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
      }}
    />
    <CardMedia
      component='img'
      image={
        venue.images && venue.images[0] && venue.images[0].url
                  ? venue.images[0].url
                  : noImage
      }
      title='show image'
    />

    <CardContent>
      <Typography
        variant='body2'
        color='textSecondary'
        component='span'
        sx={{
          borderBottom: '1px solid #1e8678',
          fontWeight: 'bold'
        }}
      >
            Location:<br/>
            {venue.address && venue.address.line1 && venue.city && venue.state && venue.city.name && venue.state.name ? (
              <div>{venue.address.line1 + ", " + venue.city.name + ", " + venue.state.name}</div>
            ) : (
              <div>N/A</div>
            )}
            Number of Upcoming Events:
            {venue.upcomingEvents && venue.upcomingEvents._total ? (
              <div>{venue.upcomingEvents._total}</div>
            ) : (
              <div>N/A</div>
            )}

            <br/>
            Visit Website:
            {venue.url ? (
                <Link to={venue.url}> Link</Link>
            ) : (
                <div> N/A</div>
            )}
      </Typography>
    </CardContent>
  </Card>)
  } else {
    return (<ErrorCard name={"Venue"}/>);
  }
};

export default VenueCard;