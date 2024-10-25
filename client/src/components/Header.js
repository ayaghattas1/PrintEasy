import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { MDBNavbar, MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import logo from '../assets/logoo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notifications from './Notifications';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function Header({ OpenSidebar }) {
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]); // State for notifications

  // Fetch user profile photo
  useEffect(() => {
    const fetchProfilePhoto = async () => {
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
            setProfilePhoto(`http://localhost:5000/uploads/${currentUser.photo.replace(/\\/g, '/')}`);
          } else {
            throw new Error('Failed to get user info.');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfilePhoto();
  }, []);

  // Fetch cart items on component load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/panier/getPanier', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.produits.concat(response.data.impressions)); // Combine products and impressions
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération du panier', err);
        setError('Erreur lors de la récupération du panier.');
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Calculate total each time cartItems changes
  useEffect(() => {
    const calculateTotal = () => {
      let totalAmount = 0;
      cartItems.forEach(item => {
        if (item.produit) { // Check if item is a product
          totalAmount += item.produit.prix * item.quantite;
        } else if (item.impression) { // Check if item is an impression
          totalAmount += item.impression.prix; // Assuming impressions have a prix field
        }
      });
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cartItems]);

  // Fetch notifications and count unread ones
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/notification', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedNotifications = response.data.notifications;
        setNotifications(fetchedNotifications);

        // Filter unread notifications
        const unreadNotifications = fetchedNotifications.filter(notification => !notification.read);
        setUnreadCount(unreadNotifications.length); // Update unread count
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    fetchNotifications();
  }, [showNotifications]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post('http://localhost:5000/notification/mark-as-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local notification state to mark all as read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0); // Reset unread count
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications && unreadCount > 0) {
      // Mark all notifications as read when the panel opens
      markAllAsRead();
    }
  };

  const handleNotificationRead = () => {
    setUnreadCount(0); // Reset the unread count when a notification is read
  };

  const toggleCart = () => {
    setShowCart(prev => !prev);
  };

  // Update item quantity in the cart via API
  const updateQuantity = async (produitId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:5000/panier/updatePanier/${produitId}`, { quantite: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.produit && item.produit._id === produitId ? { ...item, quantite: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité', error);
    }
  };

  // Remove an item from the cart via API
  const removeFromCart = async (produitId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/panier/removeFromPanier/${produitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prevItems => prevItems.filter(item => 
        (item.produit && item.produit._id !== produitId) || 
        (item.impression && item.impression._id !== produitId)
      ));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-center">
        <MDBNavbar>
          <MDBContainer fluid>
            <MDBInputGroup tag="form" className="d-flex w-auto mb-3">
              <input className="form-control" placeholder="Type query" aria-label="Search" type="Search" />
              <MDBBtn outline>Chercher</MDBBtn>
            </MDBInputGroup>
          </MDBContainer>
        </MDBNavbar>
      </div>
      <div className="header-right">
        {/* Cart Icon with toggle functionality */}
        <div className="cart-icon" onClick={toggleCart}>
          <span>🛒</span>
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </div>


        {showCart && (
          <div className="cart-box">
            <h4>Votre Panier</h4>
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.produit ? item.produit._id : item.impression._id} className="cart-item">
                  <img src={`http://localhost:5000${item.produit ? item.produit.image : item.impression.image}`} alt={item.produit ? item.produit.nom : item.impression.nom} />
                  <div className="cart-details">
                    <p>{item.produit ? item.produit.nom : item.impression.nom}</p>
                    <p>{item.produit ? item.produit.prix : item.impression.prix} DT</p>
                    <div className="cart-actions">
                      {item.produit && (
                        <input
                          type="number"
                          min="1"
                          value={item.quantite}
                          onChange={(e) => updateQuantity(item.produit._id, parseInt(e.target.value))}
                          style={{ width: '60px', margin: '0 10px' }}
                        />
                      )}
                      <IconButton onClick={() => removeFromCart(item.produit ? item.produit._id : item.impression._id)} color="secondary">
                        <Delete style={{ color: 'white' }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Votre panier est vide</p>
            )}

            <div className="cart-total">
              <h5>Total: {total} DT</h5>
              <Link to="/monPanier">Passer à la caisse</Link>
            </div>
          </div>
        )}

      {/* Notification Icon with toggle functionality */}
      <div className="notification-icon" onClick={toggleNotifications}>
        <BsFillBellFill className="icon_header" />
        {unreadCount > 0 && <span className="cart-count">{unreadCount}</span>}
        {showNotifications && (
          <div className="notifications-popup">
            <Notifications 
              notifications={notifications} 
              onNotificationRead={handleNotificationRead} 
            />
          </div>
        )}
      </div>

        {/* Profile Icon */}
        <Link to="/Profile">
          {loading ? (
            <span>Loading...</span>
          ) : profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-icon"
            />
          ) : (
            <BsPersonCircle className="icon" />
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
