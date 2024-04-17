import React from 'react';

const CraftButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{
      width: '232px',
      height: '39px',
      marginLeft: '800px',
      borderRadius: '5px 5px 5px 5px',
      opacity: '1', // Cambia a 1 para hacer visible
      backgroundColor: 'rgba(191, 6, 198, 1)',
      color: 'white',
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      border: 'none',
      cursor: 'pointer', // Cambia el cursor al pasar por encima
      fontFamily: 'Century Gothic',
      fontWeight:  'bold',
      
    }}>

    Agregar Producto
    </button>
  );
}

export default CraftButton;
