import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/ComponenteSidebarStyle.css";
import { useAuth } from '../../context/AuthContext'; // Confirma que la ruta de importación sea correcta

export const ComponenteSidebar = ({ onSectionChange }) => {
  let navigate = useNavigate();
  const { logout } = useAuth(); // Importar la función logout desde tu contexto
  const [numNotiPedido, setNumNotiPedido] = useState(0);
  const [nombreRepresentante, setNombreRepresentante] = useState("Nombre Apellido");

    const fetchNotificaciones = async () => {
      const usuarioId = localStorage.getItem('userId');
      if (!usuarioId) {
        console.error("No se encontró el ID del usuario en localStorage");
        return;
      }

      try {
        const responseCooperativa = await axios.get(
          `http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`
        );
        if (responseCooperativa.data.id) {
          const responsePedidos = await axios.get(
            `http://127.0.0.1:8000/api/cooperativas/${responseCooperativa.data.id}/ventas/?excluir_estado=entregado`
          );
          setNumNotiPedido(responsePedidos.data.length); // Actualizar la cantidad de pedidos no entregados
        } else {
          console.error("No hay ID de cooperativa asociada con este usuario");
        }
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    const updateProfileInfo = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setNombreRepresentante(userObj.usuario || "Nombre Apellido"); // Asegúrate de que 'usuario' es la propiedad correcta
      }
    };
    useEffect(() => {

    updateProfileInfo();
    fetchNotificaciones(); // Llamar a la función para obtener los pedidos
  }, []); // Agregar cualquier otra dependencia si espera que cambien también

  const cerrarSesion = () => {
    logout(); // Usa la función logout del contexto para manejar la sesión
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };

  const handleNavigation = (path) => {
      fetchNotificaciones(); // Solo recargar para pedidos y ventas
    
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div id="foto">
          <img src="https://th.bing.com/th/id/OIP.GqGVPkLpUlSo5SmeDogUdwHaHa?rs=1&pid=ImgDetMain" alt="Foto Representante" />
        </div>
        <div id="content-perfil-vendedor">
          <h3>{nombreRepresentante}</h3>
          <a id="enlace-ver-perfil" href="#" onClick={(e) => { e.preventDefault(); navigate('perfil'); }}>
            Ver perfil
          </a>
        </div>
      </div>
      <div id="contenedor-linea"><hr /></div>
      <ul className="sidebar-links">
      <li onClick={() => handleNavigation('perfilCooperativa')}>Perfil de la cooperativa</li>
        <li onClick={() => handleNavigation("artesanias")}>Artesanías</li>
        <li onClick={() => handleNavigation('artesanos')}>Artesanos</li>
        <li onClick={() => handleNavigation("ventas")}>Ventas</li>
        <li onClick={() => handleNavigation("pedidos")}>Pedidos ({numNotiPedido})</li>
        <li onClick={() => handleNavigation("reporte")}>Reportes</li>
        <li onClick={() => handleNavigation("paqueteria")}>Paqueterías</li>
        <b><li id="elemento-conf" onClick={cerrarSesion} style={{ cursor: 'pointer' }}>Cerrar Sesión</li></b>
      </ul>
    </div>
  );
};
