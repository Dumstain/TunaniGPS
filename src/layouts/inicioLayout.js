import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ComponenteHeader from '../components/ComponenteHeader';
import Footer from '../components/Footer';
import '../styles/inicio.css';
import InicioContent from '../components/inicioContent';

const InicioLayout = () => {
  const [showMainContent, setShowMainContent] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/producto') || location.pathname.startsWith('/carrito')) {
      setShowMainContent(false);
    } else {
      setShowMainContent(true);
    }
  }, [location]);

  return (
    <div className="inicio-layout">
      <header>
        <ComponenteHeader />
      </header>
      <main>
        {showMainContent ? <InicioContent /> : <Outlet />}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default InicioLayout;
