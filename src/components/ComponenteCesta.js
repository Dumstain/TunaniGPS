import React, { useState } from 'react';
import "../../src/styles/ComponenteCesta.css";
 import Header from './ComponenteHeader';
 import Footer from './Footer';
// import ProductosImagen from '../assets/imagenes/artesanos.jpg';

const ComponenteCesta = () => {
  const [cesta, setCesta] = useState([
    { id: 1, nombre: 'Producto 1', precio: 20, cantidad: 2 },
    { id: 2, nombre: 'Producto 2', precio: 15, cantidad: 1 },
    { id: 3, nombre: 'Producto 3', precio: 30, cantidad: 3 },
  ]);

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCesta(prevCesta => prevCesta.map(producto =>
      producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
    ));
  };

  const handleEliminarProducto = (id) => {
    setCesta(prevCesta => prevCesta.filter(producto => producto.id !== id));
  };

  const calcularTotal = () => {
    return cesta.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  const mostrarEjemplo = () => {
    setCesta([
      { id: 1, nombre: 'Producto Ejemplo 1', precio: 25, cantidad: 1 },
      { id: 2, nombre: 'Producto Ejemplo 2', precio: 35, cantidad: 2 },
      { id: 3, nombre: 'Producto Ejemplo 3', precio: 45, cantidad: 1 },
    ]);
  };

  return (
    <div className="contenedor-sombreado">
      <Header /> 
      <div className="contenedor-cesta">
        <div className="productos-cesta">
          <h2>Cesta de Compra</h2>
          {cesta.map(producto => (
            <div key={producto.id} className="producto-cesta">
              <div className="detalles-producto">
                <p>{producto.nombre}</p>
                <p>Precio: ${producto.precio}</p>
                <label htmlFor={`cantidad-${producto.id}`}>Cantidad:</label>
                <input
                  type="number"
                  id={`cantidad-${producto.id}`}
                  value={producto.cantidad}
                  onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value))}
                  min="1"
                />
                <button className="eliminar-producto" onClick={() => handleEliminarProducto(producto.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="resumen-cesta">
          <h2>Resumen del Pedido</h2>
        
          <p>Precio de venta: ${calcularTotal()}</p>
          <p>Gasto de envío: $5</p>
          <p>Total: ${calcularTotal() + 5}</p>
          <hr style={{ borderWidth: '10px', width: '100%', borderColor: "black" }} />
          <p>Subtotal: ${calcularTotal() + 5}</p>
          
          <div>
          <button className='cancelar'>Cancelar</button>
          <button className='pagar'>Pagar</button>
          </div>
          </div>
      </div>
      {/* Botón para mostrar ejemplos */}
      <button className="mostrar-ejemplo" onClick={mostrarEjemplo}>Mostrar Ejemplo</button>
      <Footer />
    </div>
  );
};

export default ComponenteCesta;





