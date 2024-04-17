// src/pages/PerfilRepresentante.js
import React, { useEffect, useState } from 'react';
import useRepresentanteData from '../hooks/useRepresentanteData'; // Ajusta la ruta según sea necesario

const PerfilRepresentante = () => {
  const representanteId = localStorage.getItem('userId'); // Asume que tienes un ID almacenado
  const { data: representanteData, loading, error } = useRepresentanteData(representanteId);
  
  // Si necesitas hacer transformaciones de los datos, puedes hacerlo aquí
  useEffect(() => {
    if (representanteData) {
      // Aquí puedes establecer estados adicionales basados en los datos obtenidos
      // Por ejemplo, si quieres separar el nombre, apellido paterno, etc., en diferentes estados.
    }
  }, [representanteData]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar: {error}</p>;

  return (
    <div>
      <h1>Perfil del Representante</h1>
      {representanteData && (
        <div>
          <p>Nombre: {`${representanteData.datos.nombre} ${representanteData.datos.paterno} ${representanteData.datos.materno}`}</p>
          <p>Email: {representanteData.email}</p>
          <p>Teléfono: {representanteData.datos.tel}</p>
          <p>INE: {representanteData.datos.ine}</p>
          <p>Método de Pago: {representanteData.datos.metodo_pago}</p>
          <p>Notificaciones: {representanteData.datos.notificaciones ? 'Activadas' : 'Desactivadas'}</p>
          {/* Puedes continuar agregando más campos como sea necesario */}
        </div>
      )}
    </div>
  );
};

export default PerfilRepresentante;
