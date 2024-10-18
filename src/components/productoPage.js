import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductoPage = () => {
  const navigate = useNavigate();
  const producto = JSON.parse(sessionStorage.getItem('productoSeleccionado'));

  if (!producto) {
    return <p>No se ha seleccionado ningún producto.</p>;
  }

  const agregarAlCarrito = () => {
    // Aquí puedes manejar la lógica para agregar el producto al carrito
    console.log('Producto agregado al carrito:', producto);
  };

  return (
    <div className="producto-page">
      <div className="producto-detalle">
        <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
        <h2>{producto.nombre}</h2>
        <p>{producto.precio}</p>
        <button onClick={agregarAlCarrito}>Agregar al carrito</button>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    </div>
  );
};

export default ProductoPage;
