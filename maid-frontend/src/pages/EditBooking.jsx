import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditBooking = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState({
    userId: '',
    maidId: '',
    durationMonths: '',
    startDate: '',
  });

  useEffect(() => {
    // Fetch booking data by id
    axios.get(`/api/bookings/${bookingId}`)
      .then((response) => {
        setBookingData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching booking:', err);
      });
  }, [bookingId]);

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/bookings/${bookingId}`, bookingData);
      navigate('/admin/bookings'); // Redirect back to bookings page
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Booking
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              name="userId"
              value={bookingData.userId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Maid ID"
              variant="outlined"
              fullWidth
              name="maidId"
              value={bookingData.maidId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Duration (months)"
              variant="outlined"
              fullWidth
              name="durationMonths"
              value={bookingData.durationMonths}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Start Date"
              variant="outlined"
              fullWidth
              name="startDate"
              value={bookingData.startDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Update Booking
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditBooking;
