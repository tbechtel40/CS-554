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

function AttractionListCard({attraction}) {
  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={attraction.id}>
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
          <Link to={`/attractions/${attraction.id}`}>
            <CardMedia
              sx={{
                height: '100%',
                width: '100%'
              }}
              component='img'
              image={
                attraction.images && attraction.images[0] && attraction.images[0].url
                  ? attraction.images[0].url
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
                {attraction.name}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Category: {attraction.classifications && attraction.classifications[0] && attraction.classifications[0].segment && attraction.classifications[0].segment.name ? attraction.classifications[0].segment.name : "N/A"} <br/>
                Number of Upcoming Events: {attraction.upcomingEvents && attraction.upcomingEvents._total ? attraction.upcomingEvents._total : "N/A"} <br/> 
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
      <br/>
    </Grid>
  );
}

export default AttractionListCard;
