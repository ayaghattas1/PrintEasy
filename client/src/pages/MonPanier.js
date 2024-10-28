import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import '../Css/Panier.css' ;


const MonPanier = () => {
    const [cartItems, setCartItems] = useState({ produits: [], impressions: [] });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Récupérer le panier lors du chargement du composant
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:5000/panier/getPanier', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Panier fetched:', response.data); // Ensure _id exists in the response
                setCartItems({
                    _id: response.data._id, // Assign the received _id here
                    produits: response.data.produits,
                    impressions: response.data.impressions
                });
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors de la récupération du panier', err);
                setError('Erreur lors de la récupération du panier.');
                setLoading(false);
            }
        };
        fetchCart();
    }, []);
    

    // Calculez le total à chaque mise à jour du panier
    useEffect(() => {
        const calculateTotal = () => {
            let totalAmount = 0;
            // Calculer le total des produits
            cartItems.produits.forEach(item => {
                totalAmount += parseFloat(item.produit.prix) * item.quantite;
            });
            // Calculer le total des impressions
            cartItems.impressions.forEach(item => {
                totalAmount += parseFloat(item.impression.prixfinal) || 0;
            });
            setTotal(totalAmount);
        };
        calculateTotal();
    }, [cartItems]);

    // Fonction pour mettre à jour la quantité d'un produit
    const updateQuantity = async (produitId, newQuantity) => {
        if (newQuantity < 1) return; // Ne pas permettre une quantité inférieure à 1
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`http://localhost:5000/panier/updatePanier/${produitId}`, { quantite: newQuantity }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Mettre à jour localement le panier
            setCartItems(prevItems => ({
                ...prevItems,
                produits: prevItems.produits.map(item =>
                    item.produit._id === produitId ? { ...item, quantite: newQuantity } : item
                )
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité', error);
        }
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
                                headers: { Authorization: `Bearer ${token}` },
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

                                // Remove the impression from the cart items
                                setCartItems(prevItems => ({
                                    ...prevItems,
                                    impressions: prevItems.impressions.filter(item => item.impression._id !== id)
                                }));
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

    // Fonction pour supprimer un produit du panier
    const removeFromCart = async (itemId, isImpression = false) => {
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = isImpression
                ? `http://localhost:5000/panier/removeFromImpression/${itemId}` // Endpoint for removing impressions
                : `http://localhost:5000/panier/removeFromPanier/${itemId}`; // Existing endpoint for products

            const response = await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Vérifiez la réponse et affichez le toast de succès
            if (response.status === 200) {
                toast.success('Produit supprimé avec succès!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            // Mettre à jour localement le panier
            setCartItems(prevItems => ({
                produits: prevItems.produits.filter(item => item.produit._id !== itemId),
                impressions: prevItems.impressions.filter(item => item.impression._id !== itemId)
            }));
        } catch (error) {
            toast.error('Erreur lors de la suppression du produit!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Erreur lors de la suppression du produit', error);
        }
    };

    const confirmCart = async () => {
        if (!cartItems._id) {
            toast.error('Aucun panier trouvé à confirmer!');
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(`http://localhost:5000/panier/confirmPanier/${cartItems._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            console.log('Response from server:', response); // Debugging line
    
            if (response.status === 200) {
                toast.success('Panier confirmé avec succès!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            toast.error('Erreur lors de la confirmation du panier!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Erreur lors de la confirmation du panier', error);
        }
    };
    
    

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="mon-panier">
            <h1>Mon Panier</h1>
            {cartItems.produits.length === 0 && cartItems.impressions.length === 0 ? (
                <p>Votre panier est vide.</p>
            ) : (
                <div>
                    {/* Afficher les produits */}
                    {cartItems.produits.map(item => (
                        <div key={item.produit._id} className="cart-item">
                            <img src={item.produit.image} alt={item.produit.nom} />
                            <div className="cart-details">
                                <h3>{item.produit.nom}</h3>
                                <p>Prix : {item.produit.prix} DT</p>
                                <p>Quantité : 
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantite}
                                        onChange={(e) => updateQuantity(item.produit._id, parseInt(e.target.value))}
                                        style={{ width: '60px', margin: '0 10px' }}
                                    />
                                </p>
                                <button onClick={() => removeFromCart(item.produit._id)} className="remove-button">Supprimer</button>
                            </div>
                        </div>
                    ))}
                    {/* Afficher les impressions */}
                    {cartItems.impressions.map(item => (
                        <div key={item.impression._id} className="cart-item">
                            <div className="cart-details">
                                <h3>Tirage de : {item.impression.description}</h3>
                                <p>Prix : {item.impression.prixfinal} DT</p>
                                <button onClick={() => handleDelete(item.impression._id)} className="remove-button">Supprimer</button>
                            </div>
                        </div>
                    ))}
                    <h2>Total : {total} DT</h2>
                    {/* Ajouter le bouton de confirmation */}
                    <button onClick={confirmCart} style={{ marginTop: "16px", backgroundColor: "#42a5f5", color: "#fff" }}>Confirmer Panier</button>

                    {/* Toast Container */}
                    <ToastContainer />
                </div>
            )}
        </div>
    );
    
};

export default MonPanier;