import axios from 'axios';

// Fonction pour obtenir les données du backend
export const fetchData = async () => {
  try {
    const response = await axios.get('/api/data'); // '/api/data' est l'endpoint du backend
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};