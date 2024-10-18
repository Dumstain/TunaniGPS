import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/carrito-page-style.css";

const CarritoPage = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [imagenes, setImagenes] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Obtener el carrito del local storage
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);

    // Obtener las imágenes de cada producto desde la API
    carritoGuardado.forEach(producto => {
      axios.get(`https://tunaniback-0bd56842295c.herokuapp.com/api/producto/${producto.id}/imagenes/`)
        .then(response => {
          setImagenes(prevImagenes => ({
            ...prevImagenes,
            [producto.id]: response.data.images[0] || ''
          }));
        })
        .catch(error => {
          console.error('Error al obtener las imágenes del producto:', error);
        });
    });

    // Calcular subtotal, IVA (16%) y total
    const nuevoSubtotal = carritoGuardado.reduce((acc, item) => acc + item.precio, 0);
    const nuevoIva = nuevoSubtotal * 0.16;
    const nuevoTotal = nuevoSubtotal + nuevoIva;

    setSubtotal(nuevoSubtotal);
    setIva(nuevoIva);
    setTotal(nuevoTotal);
    
    // Guardar el total en el local storage
    localStorage.setItem('subtotal', nuevoSubtotal);
    localStorage.setItem('iva', nuevoIva);
    localStorage.setItem('total', nuevoTotal);
  }, []);

  const guardarTotalEnLocalStorage = (carrito) => {
    // Calcular subtotal, IVA (16%) y total
    const nuevoSubtotal = carrito.reduce((acc, item) => acc + item.precio, 0);
    const nuevoIva = nuevoSubtotal * 0.16;
    const nuevoTotal = nuevoSubtotal + nuevoIva;
  
    // Guardar el total en el local storage
    const totalCompra = {
      subtotal: nuevoSubtotal,
      iva: nuevoIva,
      total: nuevoTotal
    };
    localStorage.setItem('totalCompra', JSON.stringify(totalCompra));
  };
  
  // Ejemplo de uso:
  guardarTotalEnLocalStorage(carrito);

  const eliminarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    // Recalcular subtotal, IVA y total
    const nuevoSubtotal = nuevoCarrito.reduce((acc, item) => acc + item.precio, 0);
    const nuevoIva = nuevoSubtotal * 0.16;
    const nuevoTotal = nuevoSubtotal + nuevoIva;

    setSubtotal(nuevoSubtotal);
    setIva(nuevoIva);
    setTotal(nuevoTotal);
    
    // Actualizar el total en el local storage
    localStorage.setItem('subtotal', nuevoSubtotal);
    localStorage.setItem('iva', nuevoIva);
    localStorage.setItem('total', nuevoTotal);

    const totalCompra = {
        subtotal: nuevoSubtotal,
        iva: nuevoIva,
        total: nuevoTotal
      };
      
      // Guardar el objeto completo en el local storage
      localStorage.setItem('totalCompra', JSON.stringify(totalCompra));
  };

  

  const confirmarCompra = () => {
    // Navegar a la página de confirmación de compra
    navigate('/datosTarjeta');
  };

  return (
    <div className="carrito-page">
      <h2>Carrito de Compras</h2>
      {carrito.length > 0 ? (
        <div className="carrito-detalle">
          {carrito.map((producto, index) => (
            <div key={index} className="carrito-producto">
              <img src={imagenes[producto.id] || 'https://via.placeholder.com/150'} alt={producto.nombre} className="carrito-imagen" />
              <div className="carrito-info">
                <h3>{producto.nombre}</h3>
                <p>Precio: ${producto.precio}</p>
                <button onClick={() => eliminarProducto(index)}>Eliminar</button>
              </div>
            </div>
          ))}
          <div className="carrito-resumen">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>IVA (16%): ${iva.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
          </div>
          <button onClick={() => navigate(-1)}>Seguir Comprando</button>
          <button onClick={confirmarCompra}>Confirmar Compra</button>
        </div>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
};

export default CarritoPage;
