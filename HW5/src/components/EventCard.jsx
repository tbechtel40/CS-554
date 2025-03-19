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
import ErrorCard from "./ErrorCard";
import '../App.css';

const apiKey = import.meta.env.VITE_TICKETMASTER_KEY;

const baseURL = `https://app.ticketmaster.com/discovery/v2/events/`;

const EventCard = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(undefined);
  let {id} = useParams();
  
  useEffect(() => {
    console.log('search useEffect fired');
    console.log("Event Id: " + id);
    async function fetchData() {
      try {
        console.log(`in fetch Event Id: ${id}`);
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
      console.log('Event Id is set');
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
    let event = pageData;
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
      title={event.name}
      sx={{
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
      }}
    />
    <CardMedia
      component='img'
      image={
        event.images && event.images[0] && event.images[0].url
                  ? event.images[0].url
                  : noImage
      }
      title='show image'
    />

    <CardContent>
      <Typography
        align="center"
        variant='body2'
        color='textSecondary'
        sx={{
          borderBottom: '1px solid #1e8678',
          fontWeight: 'bold'
        }}
      >
            Date:<br/>
            {event.dates && event.dates.start && event.dates.start.localDate?(
              <div>{event.dates.start.localDate}</div>
            ):(
              <div>N/A</div>
            )}
            
            Category:<br/>
            {event.classifications && event.classifications[0] && event.classifications[0].segment && event.classifications[0].segment.name ? (
              <div>{event.classifications[0].segment.name}</div>
            ) : (
              <div>N/A</div>
            )}

            Minimum Price:<br/>
            {event.priceRanges && event.priceRanges[0] && event.priceRanges[0].min ? (
              <div>${(Math.round(event.priceRanges[0].min * 100) / 100).toFixed(2)}</div>
            ) : (
              <div>N/A</div>
            )}

            Maximum Price:<br/>
            {event.priceRanges && event.priceRanges[0] && event.priceRanges[0].max ? (
              <div>${(Math.round(event.priceRanges[0].max * 100) / 100).toFixed(2)}</div>
            ) : (
              <div>N/A</div>
            )}

            Venue Name:<br/>
            {event._embedded && event._embedded.venues && event._embedded.venues[0] && event._embedded.venues[0].name ? (
              <div>{event._embedded.venues[0].name}</div>
            ) : (
              <div>N/A</div>
            )}


            {event._links && event._links.venues && event._links.venues[0] && event._links.venues[0].href ? (
                <Link to={"/venues/" + event._links.venues[0].href.split("/")[4].split("?")[0]}>Venue Page</Link>
            ) : (
                <div>N/A</div>
            )}

            <br/>
            <br/>

            Buy Tickets:
            {event.url ? (
                <Link to={event.url}> Link</Link>
            ) : (
                <div> N/A</div>
            )}
      </Typography>
    </CardContent>
    <CardMedia
      component='img'
      image={
        event.seatmap && event.seatmap.staticUrl
                  ? event.seatmap.staticUrl
                  : noImage
      }
      title='seating chart'
    />
  </Card>)
  } else {
    return (<ErrorCard name={"Event"}/>);
  }
};

export default EventCard;