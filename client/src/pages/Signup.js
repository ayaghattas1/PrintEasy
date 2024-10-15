import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


const defaultTheme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
    
    validateField(id, value);
  };

  const validateField = (field, value) => {
    let fieldErrors = { ...errors };

    switch (field) {
      case 'firstname':
      case 'lastname':
      case 'email':
      case 'phone':
      case 'address':
        fieldErrors[field] = value.trim() === '' ? 'Ce champ est obligatoire' : '';
        break;
      case 'password':
        fieldErrors.password = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Le mot de passe doit contenir au moins ${minLength} caractères`;
    } else if (!hasUpperCase) {
      return 'Le mot de passe doit contenir au moins une lettre majuscule';
    } else if (!hasLowerCase) {
      return 'Le mot de passe doit contenir au moins une lettre minuscule';
    } else if (!hasNumber) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    } else if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    } else {
      return '';
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Adresse e-mail invalide';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isFormValid = Object.values(errors).every((error) => error === '') &&
      Object.values(formData).every((field) => field.trim() !== '');

    if (!isFormValid) {
      setErrors({
        ...errors,
        firstname: formData.firstname.trim() === '' ? 'Ce champ est obligatoire' : '',
        lastname: formData.lastname.trim() === '' ? 'Ce champ est obligatoire' : '',
        email: validateEmail(formData.email), 
        phone: formData.phone.trim() === '' ? 'Ce champ est obligatoire' : '',
        address: formData.address.trim() === '' ? 'Ce champ est obligatoire' : '',
        password: validatePassword(formData.password),
      });
      return;
    }

    try {
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Signup successful:', result);
        navigate('/');
      } else {
        console.error('Signup error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
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
            SignUp
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstname"
                  label="Prénom"
                  autoFocus
                  value={formData.firstname}
                  onChange={handleChange}
                  error={Boolean(errors.firstname)}
                  helperText={errors.firstname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastname"
                  label="Nom"
                  value={formData.lastname}
                  onChange={handleChange}
                  error={Boolean(errors.lastname)}
                  helperText={errors.lastname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Adresse"
                  value={formData.address}
                  onChange={handleChange}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Vous avez déjà un compte ? LogIn
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
