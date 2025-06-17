import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box my={10} textAlign="center">
        <Typography variant="h3" color="error" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" mb={3}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
