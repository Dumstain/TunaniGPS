// BarraBusqueda.jsx
import React, { useState } from 'react';
import '../styles/BarraBusqueda.css';

const BarraBusqueda = () => {
  const [textoBusqueda, setTextoBusqueda] = useState('');

  const handleTextoBusquedaChange = (event) => {
    setTextoBusqueda(event.target.value);
  };

  const handleBuscarClick = () => {
    // Aquí puedes agregar lógica para realizar la búsqueda
    console.log('Texto de búsqueda:', textoBusqueda);
  };

  return (
    <div>
    <div className="barra-busqueda-container">
      <input
        type="text"
        className="barra-busqueda"
        placeholder="Camisa bordada, cesto tejido, silla de madera..."
        value={textoBusqueda}
        onChange={handleTextoBusquedaChange}
      />
      <button className="boton-buscar" onClick={handleBuscarClick}>
        Buscar
      </button>
    </div>
    
    </div>
  );
};

export default BarraBusqueda;
