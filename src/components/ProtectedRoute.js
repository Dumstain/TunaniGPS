import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('userRol');
    if (!rol) {
      // Recargar la página si el rol no está disponible después de un tiempo
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Espera 1 segundo antes de recargar
    } else {
      setReady(true);
    }
  }, []);

  if (isLoading || !ready) {
    // Mostrar la animación de carga
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div id="cargando"></div> {/* Animación de carga */}
      </div>
    );
  }

  const rol = localStorage.getItem('userRol');

  if (rol !== 'Representante') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
