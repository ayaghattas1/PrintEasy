import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/AdminPanier.css'; 

const PanierAdmin = () => {
  const [confirmedPaniers, setConfirmedPaniers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch confirmed paniers from the server
    const fetchConfirmedPaniers = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve auth token if needed
        const response = await axios.get('http://localhost:5000/panier/getConfirmed', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConfirmedPaniers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des paniers confirmés.');
        setLoading(false);
      }
    };

    fetchConfirmedPaniers();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  const calculateTotalPrice = (panier) => {
    const totalProduits = panier.produits.reduce((total, item) => {
      return total + (item.produit.prix * item.quantite);
    }, 0);

    const totalImpressions = panier.impressions.reduce((total, item) => {
      return total + item.impression.prixfinal;
    }, 0);

    return totalProduits + totalImpressions;
  };

  return (
    <div className="admin-panier">
      <h1>Paniers Confirmés</h1>
      {confirmedPaniers.length === 0 ? (
        <p>Aucun panier confirmé trouvé.</p>
      ) : (
        <div className="panier-list">
          {confirmedPaniers.map((panier) => (
            <div key={panier._id} className="panier-item">
              <div className="user-info">
                <h3>Utilisateur: {panier.user.firstname} ({panier.user.email})</h3>
              </div>
              <div className="products-section">
                <h4>Produits:</h4>
                {panier.produits.map((item) => (
                  <div key={item.produit._id} className="product-item">
                    <p>{item.produit.nom} - Prix: {item.produit.prix} DT - Quantité: {item.quantite}</p>
                  </div>
                ))}
              </div>
              <div className="impressions-section">
                <h4>Impressions:</h4>
                {panier.impressions.map((item) => (
                  <div key={item.impression._id} className="impression-item">
                    <p>{item.impression.description} - Prix Final: {item.impression.prixfinal} DT</p>
                  </div>
                ))}
              </div>
              <p>Panier confirmé: {panier.confirmed ? "Oui" : "Non"}</p>
              <h4>Prix Total: {calculateTotalPrice(panier)} DT</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanierAdmin;