import React, { useState, useEffect  } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/ComponenteSidebarStyle.css";

export const ComponenteSidebar = ({ onSectionChange }) => {
  let navigate = useNavigate();

    {/* variables para notificaciones y nombre de representante*/}
    const [numNotiReporte, setNumNotiReporte] = useState(0);
    const [numNotiPedido, setNumNotiPedido] = useState(0);
    const [nombreRepresentante, setNombreRepresentante] = useState(localStorage.getItem('userName') || "Nombre Apellido"); 

    useEffect(() => {
      const userName = localStorage.getItem('userName');

      if (userName) {
        setNombreRepresentante(userName);
      }
    }, []);


    const cerrarSesion = () => {
      // Eliminar los datos de sesión del localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      
      // Redirigir al usuario a la página de inicio o de inicio de sesión
      navigate('/');
    };


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div id="foto"><img src="https://th.bing.com/th/id/OIP.GqGVPkLpUlSo5SmeDogUdwHaHa?rs=1&pid=ImgDetMain" alt="Foto Representante"/></div>
        <div id="content-perfil-vendedor">
          <h3>{nombreRepresentante}</h3>
          <a
  id="enlace-ver-perfil"
  href="#"
  onClick={(e) => {
    e.preventDefault();
    navigate('perfil'); // Asegúrate de que la ruta coincida con tu configuración en App.js
  }}
>
  Ver perfil
</a>
        </div>
    </div>
    
    <div id="contenedor-linea"><hr/></div>

      <ul className="sidebar-links">
        <li onClick={() => navigate('perfilCooperativa')}>
        Perfil de la cooperativa
        </li>
        <li onClick={() => navigate("artesanias")}>Artesanías</li>
        <li onClick={() => navigate('artesanos')}>Artesanos</li>
        <li onClick={() => navigate("ventas")}>Ventas</li>
        <li onClick={() => navigate("pedidos")}>Pedidos ({numNotiPedido})</li>
        <li onClick={() => navigate("reporte")}>Reportes ({numNotiReporte})</li>
        <li onClick={() => navigate("paqueteria")}>Paqueterias</li>
        
        {/* Cerrar sesión, es un evento diferente */}
        <b>
        <li
          id="elemento-conf"
          onClick={cerrarSesion} // Llama a cerrarSesion cuando se haga clic
          style={{cursor: 'pointer'}} // Agrega estilo de cursor para mejorar la UX
        >
          Cerrar Sesión
        </li>
      </b>

      </ul>
    </div>
  );
};
