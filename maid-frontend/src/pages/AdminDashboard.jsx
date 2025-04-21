import React from 'react';
import { Typography, Container, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button component={Link} to="/admin/maids" variant="contained" fullWidth>
            Manage Maids
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button component={Link} to="/admin/bookings" variant="contained" fullWidth>
            Manage Bookings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
