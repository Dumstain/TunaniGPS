import React, { useState } from "react";
import "../../styles/ComponenteSidebarStyle.css";


export const ComponenteSidebar = ({ onSectionChange }) => {

    {/* variables para notificaciones y nombre de representante*/}
    const [numNotiBuzon, setNumNotiBuzon] = useState(0);
    const [numNotiReporte, setNumNotiReporte] = useState(0);
    const [numNotiPedido, setNumNotiPedido] = useState(0);
    const [nombreRepresentante, setNombreRepresentante] = useState("Nombre Apellido");

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
              e.preventDefault(); // Esto previene la navegación estándar del enlace
              onSectionChange("representanteProfile");
            }}
          >
            Ver perfil
          </a>
        </div>
    </div>
    
    <div id="contenedor-linea"><hr/></div>

      <ul className="sidebar-links">
        <li onClick={() => onSectionChange("cooperativeProfile")}>
          Perfil de la cooperativa
        </li>
        <li onClick={() => onSectionChange("artesaniasSeccion")}>Artesanías</li>
        <li onClick={() => onSectionChange("artesanosSeccion")}>Artesanos</li>
        <li onClick={() => onSectionChange("ventasSeccion")}>Ventas</li>
        <li onClick={() => onSectionChange("pedidosSeccion")}>Pedidos ({numNotiPedido})</li>
        <li onClick={() => onSectionChange("reportesSeccion")}>Reportes ({numNotiReporte})</li>
        <li onClick={() => onSectionChange("buzonSesión")}>Buzón ({numNotiBuzon})</li>
        
        {/* Cerrar sesión, es un evento diferente */}
        <b>
          <li
            id="elemento-conf"
             /* onClick={() => onSectionChange("cerrarSesión")} */
            
          >
            Cerrar Sesión
          </li>
        </b>

      </ul>
    </div>
  );
};
