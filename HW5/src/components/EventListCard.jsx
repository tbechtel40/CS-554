/* eslint-disable react/prop-types */
import noImage from '../img/download.jpeg';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';
import {Link} from 'react-router-dom';

function EventListCard({event}) {
  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={event.id}>
      <Card
        variant='outlined'
        sx={{
          maxWidth: 250,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '4px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardActionArea>
          <Link to={`/events/${event.id}`}>
            <CardMedia
              sx={{
                height: '100%',
                width: '100%'
              }}
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
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                {event.name}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Min Price: {event.priceRanges && event.priceRanges[0] && event.priceRanges[0].min ? "$" + (Math.round(event.priceRanges[0].min * 100) / 100).toFixed(2) : "N/A"} <br/>
                Max Price: {event.priceRanges && event.priceRanges[0] && event.priceRanges[0].max ? "$" + (Math.round(event.priceRanges[0].max * 100) / 100).toFixed(2) : "N/A"} <br/>
                Date: {event.dates && event.dates.start && event.dates.start.localDate ? event.dates.start.localDate : "N/A"} <br/>
                Category: {event.classifications && event.classifications[0] && event.classifications[0].segment && event.classifications[0].segment.name ? event.classifications[0].segment.name : "N/A"} <br/>
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
      <br/>
    </Grid>
  );
}

export default EventListCard;
