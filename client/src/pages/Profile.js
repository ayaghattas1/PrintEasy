import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Avatar } from '@mui/material';
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
      setImageUrl(URL.createObjectURL(selectedFile)); 
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
  
      console.log('Server response:', response.data); 
  
      if (response.status === 200 && response.data.user && response.data.user.photo) {
        const newPhotoUrl = `http://localhost:5000/uploads/${response.data.user.photo.replace(/\\/g, '/')}`;
        setImageUrl(`${newPhotoUrl}?t=${new Date().getTime()}`); 
        setFormData({ ...formData, photo: response.data.user.photo });
        alert('Photo updated successfully');
      } else {
        alert('Failed to update photo. Photo field is missing in the response.');
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      alert('An error occurred during photo upload.');
    }
  };
  
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
  <Grid item xs={12} md={8} lg={6}>
    <div style={{ padding: '20px', backgroundColor: 'transparent' }}>
      <h1>
        Mon Profil
      </h1>
      
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
          style={{ marginBottom: '20px', color: '#e0e0e0' }}  
        />
        <Button
          type="submit"
          variant="contained"
          style={{ backgroundColor: '#42a5f5', color: '#fff' }} 
        >
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
          InputLabelProps={{ style: { color: '#e0e0e0' } }}  
          InputProps={{
            style: { backgroundColor: '#424242', color: '#e0e0e0' },  
            readOnly: true
          }}
        />
        <TextField
          label="Prénom"
          variant="outlined"
          fullWidth
          margin="normal"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          InputLabelProps={{ style: { color: '#e0e0e0' } }}  
          InputProps={{
            style: { backgroundColor: '#424242', color: '#e0e0e0' }, 
          }}
        />
        <TextField
          label="Nom"
          variant="outlined"
          fullWidth
          margin="normal"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          InputLabelProps={{ style: { color: '#e0e0e0' } }}  
          InputProps={{
            style: { backgroundColor: '#424242', color: '#e0e0e0' },  
          }}
        />
        <TextField
          label="Téléphone"
          variant="outlined"
          fullWidth
          margin="normal"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          InputLabelProps={{ style: { color: '#e0e0e0' } }}  
          InputProps={{
            style: { backgroundColor: '#424242', color: '#e0e0e0' },  
          }}
        />
        <TextField
          label="Adresse"
          variant="outlined"
          fullWidth
          margin="normal"
          name="address"
          value={formData.address}
          onChange={handleChange}
          InputLabelProps={{ style: { color: '#e0e0e0' } }}  
          InputProps={{
            style: { backgroundColor: '#424242', color: '#e0e0e0' },  
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          style={{ marginTop: '16px', backgroundColor: '#42a5f5', color: '#fff' }}
        >
          Mettre à jour
        </Button>
      </form>
    </div>
  </Grid>
</Grid>

  );
};

export default Profile;
