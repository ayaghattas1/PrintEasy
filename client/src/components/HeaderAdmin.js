import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { MDBNavbar, MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import logo from '../assets/logoo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notifications from './Notifications';

function HeaderAdmin({ OpenSidebar }) {
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
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
              <MDBBtn outline>Search</MDBBtn>
            </MDBInputGroup>
          </MDBContainer>
        </MDBNavbar>
      </div>

      {/* Notification Icon with toggle functionality */}
      <div className="notification-icon" onClick={toggleNotifications}>
        <BsFillBellFill className="icon_header" />
        {unreadCount > 0 && <span className="cart-count">{unreadCount}</span>}
        {showNotifications && (
          <div className="notifications-popup">
            <Notifications 
              notifications={notifications} // Pass notifications to the Notifications component
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
    </header>
  );
}

export default HeaderAdmin;
