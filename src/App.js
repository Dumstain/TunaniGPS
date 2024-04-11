// App.js o el componente principal donde defines tus rutas
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio';
import LoginPage from './pages/LoginPage';
import RepresentantePage from './pages/RepresentantePage'; // Componente para usuarios con rol de representante
import Artesanos from './components/Artesanos';
import RepresentanteLayout from "./layouts/RepresentanteLayout"; // Asume la ruta correcta aquí
import ComponenteGestionProductos from './components/ComponenteGestionProductos';

// Importaciones adicionales...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/representante" element={<RepresentanteLayout />}>
             <Route path="artesanos" element={<Artesanos />} />
             <Route path="artesanias" element={<ComponenteGestionProductos/>} />
               {/* Aquí puedes añadir más subrutas específicas del representante */}
              </Route>
        {/* Definir más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
