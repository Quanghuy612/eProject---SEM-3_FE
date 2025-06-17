import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function AboutUs() {
  return (
    <Container maxWidth="md">
      <Box my={5}>
        <Typography variant="h4" gutterBottom>About Us</Typography>
        <Typography variant="body1">
          Welcome to Mobile Recharge App – your trusted partner for fast and secure mobile top-ups.
          Our mission is to make recharging convenient, anytime and anywhere.
        </Typography>
        <Typography variant="body1" mt={2}>
          We support multiple carriers and ensure your payments are processed safely. 
          Thank you for choosing us!
        </Typography>
      </Box>
    </Container>
  );
}
