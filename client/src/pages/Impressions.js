import React, { useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid ,Paper} from '@mui/material';
import { MDBFile } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Impressions = () => {
  const [description, setDescription] = useState('');
  const [taille, setTaille] = useState('A4');
  const [couleur, setCouleur] = useState('Noir/Blanc');
  const [typeImpr, setTypeImpr] = useState('Laser');
  const [nbPages, setNbPages] = useState('');
  const [nbFois, setNbFois] = useState('');
  const [files, setFiles] = useState(null);
  const [dateMaximale, setDateMaximale] = useState('');
  const [livraison, setLivraison] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [prixFinal, setPrixFinal] = useState(0);
  const [prixConfirme, setPrixConfirme] = useState(false);

  const navigate = useNavigate();

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
  
    let prixFinal = unitPrice * totalPages;
  
    console.log("Livraison sélectionnée:", livraison); 
    if (livraison === 'Livraison +4DT') {
      console.log("Ajout de 4 DT pour la livraison");
      prixFinal += 4000; 
    }
  
    console.log("Prix final calculé:", prixFinal); 
  
    setPrixUnitaire(unitPrice);
    setPrixFinal(prixFinal);
    setPrixConfirme(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Erreur : Vous devez être connecté pour passer cette commande.', {
        position: 'top-right',
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('description', description);
    formData.append('taille', taille);
    formData.append('couleur', couleur);
    formData.append('typeImpr', typeImpr);
    formData.append('nbPages', nbPages);
    formData.append('nbFois', nbFois);
    if (files) {
      formData.append('file', files);  
    }
    formData.append('date_maximale', dateMaximale);
    formData.append('livraison', livraison);
    formData.append('prixunitaire', prixUnitaire);
    formData.append('prixfinal', prixFinal);
  
    try {
      const response = await axios.post('http://localhost:5000/impression/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success('Votre commande a été bien envoyée !', {
          position: 'top-right',
        });
        
        setTimeout(() => {
          navigate('/commandes');
        }, 3000);
      } else {
        toast.error('Une erreur est survenue lors de l\'envoi de la commande.', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(`Erreur: ${error.response ? error.response.data : error.message}`, {
        position: 'top-right',
      });
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
    <Grid item xs={12} md={10} lg={8}>
      <Paper elevation={4} style={{ padding: "40px", borderRadius: "12px", backgroundColor: "#fff" }}>
        <h1 variant="h4" align="center" gutterBottom>
          Ajouter une Impression
        </h1>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Colonne Gauche */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Taille</InputLabel>
                <Select
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  label="Taille"
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
              />
            </Grid>

            {/* Colonne Droite */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre de Fois"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nbFois}
                onChange={(e) => setNbFois(e.target.value)}
              />
        <MDBFile
          label="Ajouter un Fichier"
          id="customFile"
          onChange={(e) => setFiles(e.target.files[0])} // Accepte un seul fichier
          style={{ marginTop: '16px', color: '#e0e0e0' }}
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
              />

              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Livraison</InputLabel>
                <Select
                  value={livraison}
                  onChange={(e) => setLivraison(e.target.value)}
                  label="Livraison"
                >
                  <MenuItem value="Livraison +4DT">Livraison +4DT</MenuItem>
                  <MenuItem value="Sur place">Sur place</MenuItem>
                </Select>
              </FormControl>

              {prixConfirme ? (
                <>
                  <Typography variant="h6" style={{ marginTop: "20px" }}>
                    Prix Unitaire: {prixUnitaire}DT
                  </Typography>
                  <Typography variant="h6">
                    Prix Final: {prixFinal}DT
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ marginTop: "16px", backgroundColor: "#42a5f5", color: "#fff" }}
                  >
                    Accepter la Commande
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={calculatePrices}
                  style={{ marginTop: "16px", backgroundColor: "#42a5f5", color: "#fff" }}
                >
                  Confirmer le Prix
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
    <ToastContainer />
  </Grid>

  );
};

export default Impressions;
