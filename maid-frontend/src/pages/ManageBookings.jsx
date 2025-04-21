import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch bookings from API
    axios.get('/api/bookings')
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  }, []);

  const handleDeleteBooking = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id)); // Remove the deleted booking from state
      setLoading(false);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setLoading(false);
    }
  };

  const handleEditBooking = (id) => {
    navigate(`/admin/bookings/edit/${id}`); // Navigate to booking edit page
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Manage Bookings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {bookings?.map((booking) => (
            <Grid item xs={12} sm={6} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{booking.user} - {booking.maid}</Typography>
                  <Typography variant="body2">{`Duration: ${booking.durationMonths} months`}</Typography>
                  <Button onClick={() => handleEditBooking(booking._id)} variant="outlined" fullWidth>
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteBooking(booking._id)} color="error" variant="contained" fullWidth>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ManageBookings;
