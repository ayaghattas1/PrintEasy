import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../Css/Notif.css';

function Notifications({ onNotificationRead }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/notification', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedNotifications = response.data.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 6000); // Rafraîchir toutes les 6 secondes
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.patch(`http://localhost:5000/notification/markAsRead/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      onNotificationRead(); // Informer le parent que la notification a été lue
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  };

  return (
<div className="notifications-box">
      {notifications.length > 0 ? (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-date">{moment(notification.date).format('D MMM, YYYY')}</p>
                {!notification.read && <span className="new-notification-indicator">●</span>} {/* Indicateur pour les notifications non lues */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune notification disponible</p>
      )}
    </div>
  );
}

export default Notifications;
