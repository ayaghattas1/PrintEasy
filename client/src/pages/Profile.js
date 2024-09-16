import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Paper, Grid, Avatar } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    email: '',
    lastname: '',
    firstname: '',
    phone: '',
    address: '',
    photo: '/uploads/unknown.png',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(formData.photo);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/user/current', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const currentUser = response.data;
            console.log('Current user:', currentUser);
            setFormData({
              email: currentUser.email,
              lastname: currentUser.lastname,
              firstname: currentUser.firstname,
              phone: currentUser.phone,
              address: currentUser.address,
              photo: `http://localhost:5000/uploads/${currentUser.photo.replace(/\\/g, '/')}`,
            });
            setImageUrl(`http://localhost:5000/uploads/${currentUser.photo.replace(/\\/g, '/')}`);
          } else {
            throw new Error('Failed to get user info.');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPhotoFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile)); // Local preview
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch('http://localhost:5000/user/updateUser', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      return alert('Please select a photo');
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('photo', photoFile);

      const token = localStorage.getItem('authToken');
      const response = await axios.patch('http://localhost:5000/user/updatePhoto', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const newPhotoUrl = `http://localhost:5000/uploads/${response.data.photo.replace(/\\/g, '/')}`;
        setImageUrl(newPhotoUrl);
        setFormData({ ...formData, photo: response.data.photo });
        alert('Photo updated successfully');
      } else {
        alert('Failed to update photo.');
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      alert('An error occurred during photo upload.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={8} lg={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Mon Profil
          </Typography>
          <form onSubmit={handleUpdatePhoto}>
            <Avatar
              src={imageUrl}
              alt="Profile Photo"
              style={{ width: '100px', height: '100px', marginBottom: '20px' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: '20px' }}
            />
            <Button type="submit" variant="contained" color="secondary">
              Changer
            </Button>
          </form>
          <form onSubmit={handleUpdateUser}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="Nom"
              value={formData.lastname}
              onChange={handleChange}
            />
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="Prénom"
              value={formData.firstname}
              onChange={handleChange}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              name="Téléphone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="adresse"
              value={formData.address}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" color="primary">
              Mettre à jour 
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
