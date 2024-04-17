import React, { useState, useEffect } from 'react';

const PerfilCooperativa = () => {
  const [cooperativa, setCooperativa] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('userId'); // Asegúrate de haber guardado el usuarioId al loguearte
    console.log("Usuario ID obtenido:", usuarioId); // Imprime el ID del usuario para verificar
    if (usuarioId) {
      fetch(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`) // Asume que tienes una API que permite esto
        .then(response => response.json())
        .then(data => setCooperativa(data))
        .catch(error => console.error("Hubo un error al cargar la información de la cooperativa:", error));
    }
  }, []);

  if (!cooperativa) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{cooperativa.nombre}</h1>
      <p>{cooperativa.descripcion}</p>
      {/* Muestra más detalles de la cooperativa como prefieras */}
    </div>
  );
};

export default PerfilCooperativa;
