import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/producto-page-style.css";
import axios from 'axios';

const ProductoPage = () => {
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const productoSeleccionado = JSON.parse(sessionStorage.getItem('productoSeleccionado'));
    if (productoSeleccionado) {
      // Llamar a la API para obtener las imágenes del producto
      axios.get(`https://tunaniback-0bd56842295c.herokuapp.com/api/producto/${productoSeleccionado.id}/imagenes/`)
        .then(response => {
          setProducto(productoSeleccionado);
          setImagenes(response.data.images);
        })
        .catch(error => {
          console.error('Error al obtener las imágenes del producto:', error);
          setProducto(productoSeleccionado); // Si falla, usar el producto sin imágenes
        });
    }
  }, []);

  if (!producto) {
    return <p>No se ha seleccionado ningún producto.</p>;
  }

  const agregarAlCarrito = () => {
    // Obtener carrito existente o crear uno nuevo
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Añadir el producto seleccionado al carrito
    carrito.push(producto);
    
    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Navegar a la página del carrito
    navigate('/carrito');
  };

  return (
    <div className="producto-page">
      <div className="producto-detalle">
        {imagenes.length > 0 ? (
          <div className="producto-imagenes">
            {imagenes.map((imagen, index) => (
              <img key={index} src={imagen} alt={`${producto.nombre} ${index + 1}`} className="producto-imagen" />
            ))}
          </div>
        ) : (
          <p>No hay imágenes disponibles para este producto.</p>
        )}
        <h2>{producto.nombre}</h2>
        <p>Precio: ${producto.precio}</p>
        <p>Categoría: {producto.categoria}</p>
        <p>Descripción: {producto.descripcion}</p>
        <p>Material: {producto.material}</p>
        <button onClick={agregarAlCarrito}>Agregar al carrito</button>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    </div>
  );
};

export default ProductoPage;
