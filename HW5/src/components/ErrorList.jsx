/* eslint-disable react/prop-types */
import {
    Card,
    CardActionArea,
    CardContent,
    Typography
  } from '@mui/material';

function NoResults(props) {
  return (
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
                404 Error: Couldn't find {props.name}
              </Typography>
            </CardContent>
        </CardActionArea>
      </Card>
  );
}

export default NoResults;