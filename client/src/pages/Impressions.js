import React, { useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid, Paper } from '@mui/material';
import { MDBFile } from 'mdb-react-ui-kit';
import axios from 'axios';

const Impressions = () => {
  const [description, setDescription] = useState('');
  const [taille, setTaille] = useState('A4');
  const [couleur, setCouleur] = useState('Noir/Blanc');
  const [typeImpr, setTypeImpr] = useState('Laser');
  const [nbPages, setNbPages] = useState('');
  const [nbFois, setNbFois] = useState('');
  const [files, setFiles] = useState(null);  // Accepter plusieurs fichiers
  const [dateMaximale, setDateMaximale] = useState('');
  const [livraison, setLivraison] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [prixFinal, setPrixFinal] = useState(0);
  const [prixConfirme, setPrixConfirme] = useState(false);

  // Fonction pour calculer les prix
  const calculatePrices = () => {
    const totalPages = parseInt(nbPages) * parseInt(nbFois);
    let unitPrice = 0;

    if (couleur === 'Couleurs' && typeImpr === 'Laser') {
      unitPrice = totalPages < 50 ? 100 : 70;
    } else if (couleur === 'Couleurs' && typeImpr === 'Impression Normale') {
      unitPrice = totalPages < 50 ? 80 : 60;
    } else if (couleur === 'Noir/Blanc' && typeImpr === 'Laser') {
      unitPrice = totalPages < 50 ? 60 : 40;
    } else if (couleur === 'Noir/Blanc' && typeImpr === 'Impression Normale') {
      unitPrice = totalPages < 50 ? 50 : 35;
    }

    setPrixUnitaire(unitPrice);
    setPrixFinal(unitPrice * totalPages);
    setPrixConfirme(true);  // Activer la section de livraison après confirmation du prix
  };

  // Fonction pour soumettre la commande
  const handleSubmit = async (event) => {
    event.preventDefault();
  // Vérification si le token est bien récupéré depuis localStorage
  const token = localStorage.getItem('token');
  console.log('Token récupéré:', token);  // Si cela n'affiche rien, le problème vient de la récupération du token

  if (!token) {
    console.error('Token non trouvé !');
    alert('Erreur : Vous devez être connecté pour passer cette commande.');
    return;  // Stoppe l'exécution si le token n'est pas trouvé
  }
    const formData = new FormData();
    formData.append('description', description);
    formData.append('taille', taille);
    formData.append('couleur', couleur);
    formData.append('typeImpr', typeImpr);
    formData.append('nbPages', nbPages);
    formData.append('nbFois', nbFois);
    if (files) {
      formData.append('file', files);  // Ajoute un seul fichier
    }
    formData.append('date_maximale', dateMaximale);
    formData.append('livraison', livraison);
    formData.append('prixunitaire', prixUnitaire);
    formData.append('prixfinal', prixFinal);
  
    try {
      const response = await axios.post('http://localhost:5000/impression/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // Assure-toi que l'en-tête Authorization est correct
        },
      });
      console.log('Response:', response.data);
      alert('Impression ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'impression:', error.response ? error.response.data : error.message);
      alert('Erreur lors de l\'ajout de l\'impression');
    }
  };
  
  

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={8} lg={6}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#333', color: '#fff' }}>
          <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
            Ajouter une Impression
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Taille</InputLabel>
              <Select
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                label="Taille"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="A1">A1</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Couleur</InputLabel>
              <Select
                value={couleur}
                onChange={(e) => setCouleur(e.target.value)}
                label="Couleur"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <MenuItem value="Noir/Blanc">Noir/Blanc</MenuItem>
                <MenuItem value="Couleurs">Couleurs</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Type d'Impression</InputLabel>
              <Select
                value={typeImpr}
                onChange={(e) => setTypeImpr(e.target.value)}
                label="Type d'Impression"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <MenuItem value="Laser">Laser</MenuItem>
                <MenuItem value="Impression Normale">Impression Normale</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nombre de Pages"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nbPages}
              onChange={(e) => setNbPages(e.target.value)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
            <TextField
              label="Nombre de Fois"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nbFois}
              onChange={(e) => setNbFois(e.target.value)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
<MDBFile
  label="Ajouter un Fichier"
  id="customFile"
  onChange={(e) => setFiles(e.target.files[0])}  // Accepte un seul fichier
  style={{ marginTop: '16px' }}
/>
            <TextField
              label="Date Maximale"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={dateMaximale}
              onChange={(e) => setDateMaximale(e.target.value)}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />

            {/* Afficher les prix après confirmation */}
            {prixConfirme ? (
              <>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Livraison</InputLabel>
                  <Select
                    value={livraison}
                    onChange={(e) => setLivraison(e.target.value)}
                    label="Livraison"
                    style={{ backgroundColor: '#fff', color: '#000' }}
                  >
                    <MenuItem value="Livraison">Livraison</MenuItem>
                    <MenuItem value="Sur place">Sur place</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="h6" style={{ marginTop: '20px' }}>
                  Prix Unitaire: {prixUnitaire}€
                </Typography>
                <Typography variant="h6">
                  Prix Final: {prixFinal}€
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ marginTop: '16px', backgroundColor: '#4caf50', color: '#fff' }}
                >
                  Accepter la Commande
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={calculatePrices}
                style={{ marginTop: '16px', backgroundColor: '#1976d2', color: '#fff' }}
              >
                Confirmer le Prix
              </Button>
            )}
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Impressions;
