import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigat
import '../styles/inicio-content-styles.css';
import Sociedades from '../assets/imagenes/sociedades.jpg';
import nodes from '../assets/imagenes/nodes.jpg';
import artesanos from '../assets/imagenes/artesanos.jpg';

const InicioContent = () => {
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState({});
  const navigate = useNavigate(); // Declarar useNavigate


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('https://tunaniback-0bd56842295c.herokuapp.com/api/productos/'); // Cambia la URL según sea necesario
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleProductoClick = (producto) => {
    sessionStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    navigate(`/producto/${producto.id}`);
  };

  return (
    <div className="inicio-content-main-content">
      <div className="inicio-content-imagenes-container">
        <div className="inicio-content-imagen-enlace">
          <img src={Sociedades} alt="Cooperativas" className="inicio-content-imagen-opaca" />
          <p className="inicio-content-texto-imagen">Cooperativas</p>
        </div>
        <div className="inicio-content-imagen-enlace">
          <img src={nodes} alt="Nodes" className="inicio-content-imagen-opaca" />
          <p className="inicio-content-texto-imagen">Nodes</p>
        </div>
        <div className="inicio-content-imagen-enlace">
          <img src={artesanos} alt="Artesanos" className="inicio-content-imagen-opaca" />
          <p className="inicio-content-texto-imagen">Artesanos</p>
        </div>
      </div>
      <div className="inicio-content-banner-publicidad">
        <p className="inicio-content-banner-texto">Publicidad</p>
      </div>
      <div className="inicio-content-productos-container">
        {productos.map((producto) => (
          <div key={producto.id} className="inicio-content-producto" onClick={() => handleProductoClick(producto)} // Añadir onClick para redirigir
>
            <div className="inicio-content-producto-imagen-container">
              {producto.fotos && producto.fotos.length > 0 ? (
                <img
                  src={producto.fotos[0].ubicacion}
                  alt={producto.nombre}
                  className="inicio-content-producto-imagen"
                />
              ) : (
                <p>Sin imagen</p>
              )}
            </div>
            <p className="inicio-content-producto-nombre">{producto.nombre}</p>
            <p className="inicio-content-producto-precio">${producto.precio}</p>
            <div
              className={`inicio-content-producto-favorito ${favoritos[producto.id] ? 'favorito-activo' : ''}`}
              onClick={() => toggleFavorito(producto.id)}
            >
              ❤
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InicioContent;