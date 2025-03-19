// ROUTE /venues/page/:page

// /discovery/v2/venues


// ROUTE /venues/:id

// /discovery/v2/venues/{id}

import {useState, useEffect} from 'react';
import axios from 'axios';
import VenueListCard from './VenueListCard';
import {Grid, Button, AppBar} from "@mui/material"
import { useParams, Link } from 'react-router-dom';
import NoResults from "./NoResults";
import '../App.css';
import SearchVenues from './SearchVenues';
import ErrorList from "./ErrorList";

const apiKey = import.meta.env.VITE_TICKETMASTER_KEY;

const baseURL = `https://app.ticketmaster.com/discovery/v2/venues?apikey=${apiKey}&countryCode=US`;

const Venues = () => {
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
        if (searchData && searchData._embedded && searchData._embedded.venues) {
            console.log("searchData fired")
            cardsData =
              searchData._embedded.venues &&
              searchData._embedded.venues.map((venue) => {
                return <VenueListCard venue={venue} key={venue.id} />;
            });
        } else {
            noResults = <NoResults />
        }
    } else {
        cardsData =
        pageData._embedded.venues &&
        pageData._embedded.venues.map((venue) => {
            return <VenueListCard venue={venue} key={venue.id} />;
        });
    }
  }

  let prevButton;
  if (page <= 1) {
    prevButton = null
  } else {
    prevButton =
    <div className="prevButtonShow">
        <Button xs={2} component={Link} to={`/venues/page/${page - 1}`} variant="contained">Previous</Button>
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
                <SearchVenues searchValue={searchValue} />
            </AppBar>
            <Grid container spacing={2} sx={{flexGrow: 1, flexDirection: 'row'}}>
              {cardsData}
              {noResults}
            </Grid>
            <br/>
            <Grid container spacing={2} direction="row" sx={{justifyContent: "center", alignItems: "center"}}>
                {prevButton}
                <div className="nextButton">
                    <Button xs={2} component={Link} to={`/venues/page/${page - (-1)}`} variant="contained">Next</Button>
                </div>
            </Grid>
          </div>
        );
      } else {
        return (<ErrorList name={"Venues"}/>);
        }
    }
};

export default Venues;