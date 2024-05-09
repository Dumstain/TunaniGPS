import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;  // Muestra un spinner o mensaje mientras carga
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;  // Cambiado para usar exportación por defecto
