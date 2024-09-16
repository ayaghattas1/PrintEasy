import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, MenuItem, Select, Avatar, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import FileIcon from '../components/FileIcon';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#e0e0e0',
  borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#f0f0f0', // Light background for the select component
  color: theme.palette.text.primary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[600],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary,
  },
}));

const AdminDash = () => {
  const [impressions, setImpressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEtat, setSelectedEtat] = useState(''); // État sélectionné pour le filtre

  useEffect(() => {
    const fetchImpressions = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Vous devez être connecté pour voir vos commandes.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/impression/getImp', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { etat: selectedEtat }, // Passer le filtre en tant que paramètre
        });
        console.log(response.data);

        if (Array.isArray(response.data)) {
          setImpressions(response.data);
        } else {
          setError('Aucune commande trouvée.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setError('Erreur lors de la récupération des commandes.');
        setLoading(false);
      }
    };

    fetchImpressions();
  }, [selectedEtat]); // Recharger les impressions lorsque l'état sélectionné change

  const handleEtatChange = (event) => {
    setSelectedEtat(event.target.value);
  };

  const renderEtatChip = (etat) => {
    let color = 'default';
    switch (etat) {
      case 'En cours de confirmation':
        color = '#FFC107';
        break;
      case 'Confirmé':
        color = '#28A745';
        break;
      case 'Délivré':
        color = 'purple';
        break;
      case 'Prêt':
        color = '#007BFF';
        break;
      case 'Annulé':
        color = '#DC3545';
        break;
      default:
        break;
    }
    return <Chip label={etat} style={{ backgroundColor: color, color: '#fff' }} />;
  };

  if (loading) {
    return <CircularProgress color="inherit" />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <h1>Les Commandes</h1>
      <FormControl variant="outlined" style={{ minWidth: 150, marginLeft: '10px', marginBottom: 20 }}>
        <StyledSelect
          value={selectedEtat}
          onChange={handleEtatChange}
          displayEmpty
          label="Filtre"
        >
          <MenuItem value="">Filtre</MenuItem>
          <MenuItem value="En cours de confirmation">En cours de confirmation</MenuItem>
          <MenuItem value="Confirmé">Confirmé</MenuItem>
          <MenuItem value="Délivré">Délivré</MenuItem>
          <MenuItem value="Prêt">Prêt</MenuItem>
          <MenuItem value="Annulé">Annulé</MenuItem>
        </StyledSelect>
      </FormControl>
      <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell> </StyledTableCell>
              <StyledTableCell>Date de Création</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Taille</StyledTableCell>
              <StyledTableCell>Couleur</StyledTableCell>
              <StyledTableCell>Type d'Impression</StyledTableCell>
              <StyledTableCell>Nombre de Pages</StyledTableCell>
              <StyledTableCell>Nombre d’Exemplaires</StyledTableCell>
              <StyledTableCell>Prix Final</StyledTableCell>
              <StyledTableCell>Date Limite</StyledTableCell>
              <StyledTableCell>Fichiers Attachés</StyledTableCell>
              <StyledTableCell>Livraison</StyledTableCell>
              <StyledTableCell>État</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {impressions.map((impression) => (
              <StyledTableRow key={impression._id}>
                <StyledTableCell>
                  <Avatar
                    src={`http://localhost:5000/uploads/${impression.owner.photo}`}
                    alt="User Avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                </StyledTableCell>
                <StyledTableCell>{moment(impression.createdAt).format('DD/MM/YYYY')}</StyledTableCell>
                <StyledTableCell>{impression.description}</StyledTableCell>
                <StyledTableCell>{impression.taille}</StyledTableCell>
                <StyledTableCell>{impression.couleur}</StyledTableCell>
                <StyledTableCell>{impression.typeImpr}</StyledTableCell>
                <StyledTableCell>{impression.nbPages}</StyledTableCell>
                <StyledTableCell>{impression.nbFois}</StyledTableCell>
                <StyledTableCell>{impression.prixfinal} DT</StyledTableCell>
                <StyledTableCell>{impression.date_maximale ? moment(impression.date_maximale).format('DD/MM/YYYY') : 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  {impression.file && impression.file.map((fileName) => (
                    <FileIcon key={fileName} fileName={fileName} />
                  ))}
                </StyledTableCell>
                <StyledTableCell>{impression.livraison}</StyledTableCell>
                <StyledTableCell>{renderEtatChip(impression.etat)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminDash;
