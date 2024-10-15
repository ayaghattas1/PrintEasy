import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const validatePasswordComplexity = (password) => {
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return complexityRegex.test(password);
};

export default function ResetPassword() {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!validatePasswordComplexity(newPassword)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.'
      );
      return;
    }

    try {

        const response = await axios.post(`http://localhost:5000/user/reset-password/${token}`, {
        newPassword,
      });

      if (response.status === 200) {
        setSuccess('Mot de passe réinitialisé avec succès. Redirection vers la page de connexion...');
        setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
      } else {
        setError(response.data.message || 'Échec de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Réinitialiser le mot de passe
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Réinitialiser le mot de passe
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
