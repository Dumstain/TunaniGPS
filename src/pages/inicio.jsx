
import React from 'react';
import '../styles/inicio.css';
import BarraBusqueda from '../components/BarraBusqueda';
import Header from '../components/ComponenteHeader';
import Footer from '../components/Footer';
import Sociedades from '../assets/imagenes/sociedades.jpg';
import nodes from '../assets/imagenes/nodes.jpg';
import artesanos from '../assets/imagenes/artesanos.jpg';

const Inicio = () => {
  return (
    <div>
      <div>
        <div>
          <Header /><br/><br/><br/><br/><br/><br/><br/><br/>
          <div></div>
        </div>
        <BarraBusqueda />
        <div>
          <div className="imagenes-container">
            <div className="imagen-enlace">
              <img src={Sociedades} alt="Sociedades" className="imagen-opaca" />
              <p className="texto-imagen">Sociedades</p>
            </div>
            <div className="imagen-enlace">
              <img src={nodes} alt="Nodes" className="imagen-opaca" />
              <p className="texto-imagen">Nodes</p>
            </div>
            <div className="imagen-enlace">
              <img src={artesanos} alt="Artesanos" className="imagen-opaca" />
              <p className="texto-imagen">Artesanos</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inicio;
