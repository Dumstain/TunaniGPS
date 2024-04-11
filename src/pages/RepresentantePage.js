
import React, { useState } from 'react';
import '../../src/styles/representante.css';
import { ComponenteSidebar } from '../components/sidebar/ComponenteSidebar';
import ComponenteHeader from '../components/ComponenteHeader';
import { ComponenteFooterPag } from '../components/ComponenteFooterPag';
import { ComponenteHeaderSidebar } from '../components/sidebar/ComponenteHeaderSidebar';
import ComponenteGestionProductos from '../components/ComponenteGestionProductos';

function RepresentantePage() {

  const [activeSection, setActiveSection] = useState('cooperativeProfile');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'representanteProfile':
        return <div>Contenido del Perfil del Representante</div>;

      case 'cooperativeProfile':
        return <div>Contenido del Perfil de la Cooperativa</div>;
      
      case 'artesaniasSeccion':
        return <div><ComponenteGestionProductos/></div>;
      
      case 'artesanosSeccion':
          return <div>Contenido altas y bajas de artesanos</div>;
      
      case 'ventasSeccion':
        return <div>Contenido para ver ventas</div>;

      case 'pedidosSeccion':
        return <div>Contenido de pedidos</div>;

      case 'reportesSeccion':
        return <div>Contenido para ver reportes</div>;
    
      case 'buzonSesión':
        return <div>Contenido de buzon</div>;
        
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };


  return (
    <div className="app">
      <header>
        <ComponenteHeaderSidebar/>
      </header>
      <body>
        <ComponenteSidebar onSectionChange={handleSectionChange} />
        <div className="main-content">
          {renderSection()}
        </div>
      </body>
      <footer>
      </footer>
    
  </div>

  );
}

export default RepresentantePage;
