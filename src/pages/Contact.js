import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function ContactUs() {
  return (
    <Container maxWidth="sm">
      <Box my={5}>
        <Typography variant="h4" gutterBottom>Contact Us</Typography>
        <Typography variant="body1" mb={2}>
          We'd love to hear from you! Fill out the form below or reach us at support@mobilerecharge.com
        </Typography>
        <TextField fullWidth label="Your Name" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" />
        <TextField
          fullWidth
          label="Message"
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Box>
    </Container>
  );
}
