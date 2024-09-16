import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import FileIcon from '../components/FileIcon';  
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


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

const Commandes = () => {
  const [impressions, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Vous devez être connecté pour voir vos commandes.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/impression/getMesImp', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        if (Array.isArray(response.data)) {
          setCommandes(response.data);
        } else if (response.data.impressions && Array.isArray(response.data.impressions)) {
          setCommandes(response.data.impressions);
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

    fetchCommandes();
  }, []);

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
  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette impression ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            try {
              const token = localStorage.getItem('authToken');
              const response = await axios.delete(`http://localhost:5000/impression/deleteImp/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (response.status === 200) {
                toast.success('Impression supprimée avec succès!', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
  
                setCommandes((prevImpressions) =>
                  prevImpressions.filter((impression) => impression._id !== id)
                );
              }
            } catch (error) {
              toast.error('Erreur lors de la suppression !', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          },
        },
        {
          label: 'Non',
          onClick: () => {},
        },
      ],
    });
  };
  
  // Function to handle modify (you can redirect to a new page or show a modal)
  const handleModify = (id) => {
    // You can redirect to the edit page, or open a modal with the existing data
    console.log('Modify impression with ID:', id);
    // Example: window.location.href = `/editImpression/${id}`;
  };

  if (loading) {
    return <CircularProgress color="inherit" />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
    <h1>Mes Commandes</h1>
    <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
      <Table>
        <TableHead>
          <TableRow>
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
            <StyledTableCell>Actions</StyledTableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {impressions.map((impression) => (
            <StyledTableRow key={impression._id}>
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
              <StyledTableCell>
  {impression.etat === 'En cours de confirmation' && (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <IconButton onClick={() => handleModify(impression._id)} color="primary">
        <Edit style={{ color: 'white' }} />
      </IconButton>
      <IconButton onClick={() => handleDelete(impression._id)} color="secondary">
        <Delete style={{ color: 'white' }} />
      </IconButton>
    </div>
  )}
</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default Commandes;