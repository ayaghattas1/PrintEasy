import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, MenuItem, Select, Avatar, TablePagination, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
  backgroundColor: '#f0f0f0',
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

const StyledPagination = styled(TablePagination)(({ theme }) => ({
  color: '#000',
  '& .MuiTablePagination-selectIcon': {
    color: '#000',
  },
  '& .MuiTablePagination-actions button': {
    color: '#000',
  },
}));

const AdminDash = () => {
  const [impressions, setImpressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEtat, setSelectedEtat] = useState(''); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(7); 

  const [open, setOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null); 
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedImpression, setSelectedImpression] = useState(null); 
  const [newEtat, setNewEtat] = useState(''); 

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
          params: { etat: selectedEtat }, 
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
  }, [selectedEtat]); 

//   useEffect(() => {
//     const fetchUserData = async () => {
//         try {
//             const response = await fetch(`http://localhost:5000/user/${userId}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch user data');
//             }
//             const data = await response.json();
//             setSelectedOwner(data);
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchUserData();
// }, [userId]);

  const handleEtatChange = (event) => {
    setSelectedEtat(event.target.value);
  };

  const handleAvatarClick = (owner) => {
    console.log("Selected Owner:", owner); // Add this line to inspect the data
    setSelectedOwner(owner);
    setOpen(true);
};

  const handleClose = () => {
    setOpen(false);
    setSelectedOwner(null);
  };

  const handleDetailsClick = (impression) => {
    setSelectedImpression(impression);
    setNewEtat(impression.etat); 
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedImpression(null);
  };

  const handleEtatChangeInDetailsModal = (event) => {
    setNewEtat(event.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedImpression) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Vous devez être connecté pour mettre à jour l\'impression.');
        return;
      }

      await axios.patch(`http://localhost:5000/impression/updateImp/${selectedImpression._id}`, 
        { etat: newEtat }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setImpressions(impressions.map((imp) => 
        imp._id === selectedImpression._id ? { ...imp, etat: newEtat } : imp
      ));
      handleDetailsClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'impression:', error);
      setError('Erreur lors de la mise à jour de l\'impression.');
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress color="inherit" />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Les impressions</h1>
        <FormControl variant="outlined" style={{ minWidth: 100, maxWidth: 150, marginRight: '20px' }}>
          <InputLabel>Filtre</InputLabel>
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
      </div>

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
              <StyledTableCell>Détails</StyledTableCell> {/* Nouvelle colonne pour le bouton Détails */}
            </TableRow>
          </TableHead>
          <TableBody>
            {impressions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((impression) => (
              <StyledTableRow key={impression._id}>
                <StyledTableCell>
                  <Avatar
                    src={`http://localhost:5000/uploads/${impression.owner.photo}`}
                    alt="Profile"
                    onClick={() => handleAvatarClick(impression.owner)}
                    style={{ cursor: 'pointer' }}
                  />
                </StyledTableCell>
                <StyledTableCell style={{ color: '#333' }} >{moment(impression.createdAt).format('YYYY-MM-DD')}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.description}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.taille}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.couleur}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.typeImpr}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.nbPages}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.nbFois}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.prixfinal}DT</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{moment(impression.date_maximale).format('YYYY-MM-DD')}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>
                  {impression.file.map((file, index) => (
                    <div key={index}>
                      <FileIcon fileName={file} />
                    </div>
                  ))}
                </StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{impression.livraison}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>{renderEtatChip(impression.etat)}</StyledTableCell>
                <StyledTableCell style={{ color: '#333' }}>
                  <Button variant="contained" color="primary" onClick={() => handleDetailsClick(impression)}>
                    Détails
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StyledPagination style={{ color: '#333' }}
        rowsPerPageOptions={[7, 14, 21]}
        component="div"
        count={impressions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle style={{ backgroundColor: '#27293d', color: '#fff', textAlign: 'center' }}>
    Profil du Client
  </DialogTitle>
  
  <DialogContent style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
    {selectedOwner && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar avec une bordure et une ombre */}
        <Avatar
          src={`http://localhost:5000/uploads/${selectedOwner.photo}`}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            marginBottom: 20,
            border: '3px solid #007BFF',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Nom complet en gras et titre */}
        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: 10 }}>
          {selectedOwner.firstname} {selectedOwner.lastname}
        </Typography>

        {/* Informations personnelles dans une grille */}
        <div style={{ display: 'grid', rowGap: '10px', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="textSecondary">Email :</Typography>
            <Typography variant="body1">{selectedOwner.email}</Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="textSecondary">Téléphone :</Typography>
            <Typography variant="body1">{selectedOwner.phone}</Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="textSecondary">Adresse :</Typography>
            <Typography variant="body1">{selectedOwner.address}</Typography>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
  
  <DialogActions style={{ padding: '16px', backgroundColor: '#f5f5f5', justifyContent: 'center' }}>
    <Button
      onClick={handleClose}
      style={{
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        fontWeight: 'bold',
      }}
    >
      Fermer
    </Button>
  </DialogActions>
</Dialog>



<Dialog 
  open={detailsOpen} 
  onClose={handleDetailsClose} 
  maxWidth="md" 
  fullWidth
  PaperProps={{
    style: {
      backgroundColor: '#1e1e2f', 
      color: '#fff', 
      borderRadius: '10px',
    },
  }}
>
  <DialogTitle 
    style={{ 
      backgroundColor: '#27293d', 
      color: '#fff', 
      padding: '16px 24px',
      borderBottom: '1px solid #3a3a4d', 
    }}
  >
    Détails de l'Impression
  </DialogTitle>
  
  <DialogContent style={{ padding: '24px' }}>
    {selectedImpression && (
      <>
        <Typography variant="h6" style={{ color: '#76c7c0', marginBottom: '16px' }}>
          Description: <span style={{ color: '#e0e0e0' }}>{selectedImpression.description}</span>
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Taille:</strong> {selectedImpression.taille}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Couleur:</strong> {selectedImpression.couleur}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Type d'Impression:</strong> {selectedImpression.typeImpr}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Nombre de Pages:</strong> {selectedImpression.nbPages}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Nombre d’Exemplaires:</strong> {selectedImpression.nbFois}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Prix Unitaire:</strong> {selectedImpression.prixunitaire}DT
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Prix Final:</strong> {selectedImpression.prixfinal}DT
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Date Limite:</strong> {moment(selectedImpression.date_maximale).format('YYYY-MM-DD')}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '16px' }}>
          <strong>Livraison:</strong> {selectedImpression.livraison}
        </Typography>
        
        <Typography variant="body1" style={{ marginBottom: '8px' }}>
          <strong>Fichiers Attachés:</strong>
        </Typography>
        {selectedImpression.file.map((file, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <FileIcon fileName={file} />
          </div>
        ))}

        <Typography variant="h6" style={{ color: '#76c7c0', marginBottom: '8px' }}>
          État:
        </Typography>
        
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 20 }}>
          <InputLabel ></InputLabel>
          <StyledSelect
            value={newEtat}
            onChange={handleEtatChangeInDetailsModal}
            label="État"
            style={{
              backgroundColor: '#2c2c3e', 
              color: '#fff', 
              borderRadius: '5px',
            }}
          >
            <MenuItem value="En cours de confirmation">En cours de confirmation</MenuItem>
            <MenuItem value="Confirmé">Confirmé</MenuItem>
            <MenuItem value="Délivré">Délivré</MenuItem>
            <MenuItem value="Prêt">Prêt</MenuItem>
            <MenuItem value="Annulé">Annulé</MenuItem>
          </StyledSelect>
        </FormControl>
      </>
    )}
  </DialogContent>
  
  <DialogActions style={{ padding: '16px', borderTop: '1px solid #3a3a4d' }}>
    <Button 
      onClick={handleUpdate} 
      style={{
        backgroundColor: '#76c7c0',
        color: '#1e1e2f',
        marginRight: '8px',
        borderRadius: '5px',
        padding: '8px 16px',
      }}
    >
      Mettre à jour
    </Button>
    
    <Button 
      onClick={handleDetailsClose} 
      style={{
        backgroundColor: '#ff6b6b',
        color: '#fff',
        borderRadius: '5px',
        padding: '8px 16px',
      }}
    >
      Fermer
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default AdminDash;
