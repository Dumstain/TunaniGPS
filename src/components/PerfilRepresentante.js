// src/pages/PerfilRepresentante.js
import React, { useEffect, useState } from "react";
import useRepresentanteData from "../hooks/useRepresentanteData"; // Ajusta la ruta según sea necesario
import '../../src/styles/perfil_representante_style.css';
import '../../src/styles/animaciones-style.css';

const PerfilRepresentante = () => {
  const representanteId = localStorage.getItem("userId"); // Asume que tienes un ID almacenado
  const {
    data: representanteData,
    loading,
    error,
  } = useRepresentanteData(representanteId);

  // Si necesitas hacer transformaciones de los datos, puedes hacerlo aquí
  useEffect(() => {
    if (representanteData) {
      // Aquí puedes establecer estados adicionales basados en los datos obtenidos
      // Por ejemplo, si quieres separar el nombre, apellido paterno, etc., en diferentes estados.
    }
  }, [representanteData]);

  if (loading) return <div id="cargando"></div>;
  if (error) return <p>Error al cargar: {error}</p>;

  return (
    <div className="perfil-representante-container">
      <h1 className="titulo-perfil-representante">Datos del Perfil</h1>
      {representanteData && (
        <div className="perfil-representante-datos-container">
          <p className="perfil-representante-datos" data-label="Nombre:">
            {`${representanteData.datos.nombre} ${representanteData.datos.paterno} ${representanteData.datos.materno}`}
          </p >
          <p className="perfil-representante-datos" data-label="Correo Electronico:">{representanteData.email}</p>
          <p className="perfil-representante-datos" data-label="Teléfono:">{representanteData.datos.tel}</p>
          <p className="perfil-representante-datos" data-label="INE:">{representanteData.datos.ine}</p>
          <p className="perfil-representante-datos" data-label="Método de Pago:"> {representanteData.datos.metodo_pago}</p>
          <p className="perfil-representante-datos" data-label="Notificaciones:">
            {" "}
            {representanteData.datos.notificaciones
              ? "Activadas"
              : "Desactivadas"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PerfilRepresentante;
