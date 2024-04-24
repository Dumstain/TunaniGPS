import React from "react";
import { Outlet } from "react-router-dom";
import { ComponenteSidebar } from "../components/sidebar/ComponenteSidebar";
import { ComponenteHeaderSidebar } from "../components/sidebar/ComponenteHeaderSidebar";
import '../styles/representante-layout-styles.css';


const RepresentanteLayout = () => {
  return (
    <div className="app">
      <header>
        <ComponenteHeaderSidebar />
      </header>
      <div className="main-content-wrapper"> {/* Replaced <body> tag with <div> */}
        <ComponenteSidebar />
        <div className="main-content">
          <Outlet /> {/* This component renders the current route's component */}
        </div>
      </div>
      <footer>
        {/* Placeholder for your footer content */}
      </footer>
    </div>
  );
};

export default RepresentanteLayout;
