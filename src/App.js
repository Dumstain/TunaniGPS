// App.js o el componente principal donde defines tus rutas
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio';
import LoginPage from './pages/LoginPage';
import Artesanos from './components/ArtesanosComponente';
import RepresentanteLayout from "./layouts/RepresentanteLayout"; // Asume la ruta correcta aquí
import ComponenteGestionProductos from './components/ComponenteGestionProductos';
import ComponenteCooperativa from './components/ComponenteCooperativa';
import ComponentePedido from './components/ComponentePedido';
import PerfilRepresentante from './components/PerfilRepresentante';
import ComponenteVenta from './components/ComponenteVenta';
import ComponentePaqueteria from './components/ComponentePaqueteria';
import ComponentePerfilUsuario from './components/ComponentePerfilUsuario';
import ComponenteReporte from './components/ComponenteReporte';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ComponenteImprimirDatosDeposito } from './components/ComponenteImprimirDatosDeposito';
import { ComponenteFormaPago } from './components/ComponenteFormaPago';
import ComponentePagoTarjeta from './components/ComponentePagoTarjeta';
import ProductoPage from './components/productoPage';
import CarritoPage from './components/CarritoPage';
import ComponenteCesta from './components/ComponenteCesta';




import InicioLayout from './layouts/inicioLayout';


// Importaciones adicionales.....

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        
        <Route path="/" element={<InicioLayout />}>
            <Route index element={<Inicio />} />
            <Route path="producto/:id" element={<ProductoPage />} />
            <Route path="carrito" element={<CarritoPage />} />
            <Route path="cesta" element={<ComponenteCesta />} />

            

        </Route>
        <Route path="perfilUsuario" element={<ComponentePerfilUsuario/>} /> // Ruta para el perfil del usuario
        <Route path="datosDeposito" element={<ComponenteImprimirDatosDeposito />} /> // Ruta para el ticket de los datos de compra para deposito
        <Route path="datosFormaPago" element={<ComponenteFormaPago />} /> // Ruta para selelcionar el
        <Route path="datosTarjeta" element={<ComponentePagoTarjeta />} /> // Ruta para el ticket de los datos de compra para deposito
        <Route path="/login" element={<LoginPage />} />
          {/* Rutas protegidas para el representante */}
          <Route path="/representante/*" element={
            <ProtectedRoute>
              <RepresentanteLayout />
            </ProtectedRoute>
          }>
             <Route path="artesanos" element={<Artesanos />} />
             <Route path="artesanias" element={<ComponenteGestionProductos/>} />
             <Route path="perfilCooperativa" element={<ComponenteCooperativa />} />
             <Route path="perfil" element={<PerfilRepresentante/>} /> // Ruta para el perfil del representante
             <Route path="pedidos" element={<ComponentePedido/>} /> // Ruta para el perfil del representante
             <Route path="ventas" element={<ComponenteVenta />} /> // Ruta para el perfil del representante
             <Route path="paqueteria" element={<ComponentePaqueteria />} /> // Ruta para el perfil del representante
             <Route path="reporte" element={<ComponenteReporte />} /> // Ruta para el perfil del representante


               {/* Aquí puedes añadir más subrutas específicas del representante */}
              </Route>
        {/* Definir más rutas según sea necesario */}
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
