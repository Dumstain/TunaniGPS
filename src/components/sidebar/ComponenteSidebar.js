import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/ComponenteSidebarStyle.css";
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta de importación sea correcta

export const ComponenteSidebar = ({ onSectionChange }) => {
  let navigate = useNavigate();
  const { logout } = useAuth(); // Importar la función logout desde tu contexto
  const [numNotiBuzon, setNumNotiBuzon] = useState(0);
  const [numNotiReporte, setNumNotiReporte] = useState(0);
  const [numNotiPedido, setNumNotiPedido] = useState(0);
  const [nombreRepresentante, setNombreRepresentante] = useState("Nombre Apellido");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setNombreRepresentante(userObj.usuario || "Nombre Apellido"); // Asegúrate de que 'usuario' es la propiedad correcta
    }
  }, []);

  const cerrarSesion = () => {
    logout(); // Usa la función logout del contexto para manejar la sesión
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div id="foto"><img src="https://th.bing.com/th/id/OIP.GqGVPkLpUlSo5SmeDogUdwHaHa?rs=1&pid=ImgDetMain" alt="Foto Representante"/></div>
        <div id="content-perfil-vendedor">
          <h3>{nombreRepresentante}</h3>
          <a id="enlace-ver-perfil" href="#" onClick={(e) => { e.preventDefault(); navigate('perfil'); }}>
            Ver perfil
          </a>
        </div>
      </div>
      <div id="contenedor-linea"><hr/></div>
      <ul className="sidebar-links">
        <li onClick={() => navigate('perfilCooperativa')}>Perfil de la cooperativa</li>
        <li onClick={() => navigate("artesanias")}>Artesanías</li>
        <li onClick={() => navigate('artesanos')}>Artesanos</li>
        <li onClick={() => navigate("ventas")}>Ventas</li>
        <li onClick={() => navigate("pedidos")}>Pedidos ({numNotiPedido})</li>
        <li onClick={() => navigate("reporte")}>Reportes ({numNotiReporte})</li>
        <li onClick={() => navigate("paqueteria")}>Paqueterías</li>
        <b><li id="elemento-conf" onClick={cerrarSesion} style={{cursor: 'pointer'}}>Cerrar Sesión</li></b>
      </ul>
    </div>
  );
};
