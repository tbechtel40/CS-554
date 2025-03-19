// ROUTE /events/page/:page

// /discovery/v2/events


// ROUTE /events/:id

// /discovery/v2/events/{id}

import {useState, useEffect} from 'react';
import axios from 'axios';
import EventListCard from './EventListCard';
import {Grid, Button, AppBar} from "@mui/material"
import { useParams, Link } from 'react-router-dom';
import NoResults from './NoResults';
import '../App.css';
import SearchEvents from './SearchEvents';
import ErrorList from "./ErrorList";

const apiKey = import.meta.env.VITE_TICKETMASTER_KEY;

const baseURL = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&countryCode=US`;

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(undefined);
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  let cardsData = null;
  let noResults = null;
  let {page} = useParams();

  useEffect(() => {
    console.log('search useEffect fired');
    console.log("Page Number: " + (page - 1));
    async function fetchData() {
      try {
        console.log(`in fetch pageNumber: ${(page - 1)}`);
        const {data} = await axios.get(baseURL + "&page=" + (page - 1));
        console.log(baseURL + "&page=" + (page - 1));
        setPageData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setPageData(undefined);
        setLoading(false);
      }
    }
    if (page) {
      console.log('pageNumber is set');
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        let searching = "";
        if(searchTerm != "") {
            searching = "&keyword=" + searchTerm;
        }
        const {data} = await axios.get(baseURL + "&page=" + (page - 1) + searching);
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
    }
  }, [page, searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  if(page && pageData) {
    if (searchTerm != "") {
        if (searchData && searchData._embedded && searchData._embedded.events) {
            console.log("searchData fired")
            cardsData =
              searchData._embedded.events &&
              searchData._embedded.events.map((event) => {
                return <EventListCard event={event} key={event.id} />;
            });
        } else {
            noResults = <NoResults />
        }
    } else {
        cardsData =
        pageData._embedded.events &&
        pageData._embedded.events.map((event) => {
            return <EventListCard event={event} key={event.id} />;
        });
    }
  }

  let prevButton;
  if (page <= 1) {
    prevButton = null
  } else {
    prevButton =
    <div className="prevButtonShow">
        <Button xs={2} component={Link} to={`/events/page/${page - 1}`} variant="contained">Previous</Button>
    </div>
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    if (pageData) {
        return (
            <div>
              <AppBar position="fixed">
                  <SearchEvents searchValue={searchValue} />
              </AppBar>
              <Grid container spacing={2} sx={{flexGrow: 1, flexDirection: 'row'}}>
                {cardsData}
                {noResults}
              </Grid>
              <br/>
              <Grid container spacing={2} direction="row" sx={{justifyContent: "center", alignItems: "center"}}>
                  {prevButton}
                  <div className="nextButton">
                      <Button xs={2} component={Link} to={`/events/page/${page - (-1)}`} variant="contained">Next</Button>
                  </div>
              </Grid>
            </div>
          );
    } else {
        return (<ErrorList name={"Events"}/>);
    } 
  }
};

export default Events;