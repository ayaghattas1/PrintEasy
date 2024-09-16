import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Redirige vers la page de login si aucun token n'est présent
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
