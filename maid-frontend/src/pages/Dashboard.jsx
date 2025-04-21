import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      {/* You can add components like Sidebar, Stats, etc. */}
    </Container>
  );
};

export default Dashboard;
