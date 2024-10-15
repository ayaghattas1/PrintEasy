import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, CssBaseline } from '@mui/material';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/user/forgot-password', { email });

      if (response.status === 200) {
        setMessage('Un e-mail de réinitialisation de mot de passe a été envoyé.');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      setError('Erreur lors de la demande de réinitialisation. Veuillez vérifier votre adresse e-mail.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Mot de passe oublié
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Envoyer
          </Button>
          {message && <Typography color="primary">{message}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
}
