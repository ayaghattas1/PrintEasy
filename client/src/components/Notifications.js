import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/admin/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-box">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p>{notification.message}</p>
            <span>{new Date(notification.date).toLocaleString()}</span>
          </div>
        ))
      ) : (
        <p>Aucune notification disponible</p>
      )}
    </div>
  );
}

export default Notifications;
