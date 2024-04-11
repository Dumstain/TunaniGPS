import React from "react";
import { Outlet } from "react-router-dom"; // Importa Outlet de react-router-dom
import { ComponenteSidebar } from "../components/sidebar/ComponenteSidebar";
import { ComponenteHeaderSidebar } from "../components/sidebar/ComponenteHeaderSidebar";

const RepresentanteLayout = () => {
  return (
    <div className="app">
      <header>
        <ComponenteHeaderSidebar />
      </header>
      <body>
        <ComponenteSidebar />
        <div className="main-content">
          <Outlet /> {/* Este componente renderiza el componente actual de la ruta */}
        </div>
      </body>
      <footer>
        {/* Tu footer aquí */}
      </footer>
    </div>
  );
};

export default RepresentanteLayout;
