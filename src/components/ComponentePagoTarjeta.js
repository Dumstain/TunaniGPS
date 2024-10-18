import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../src/styles/ComponentePagoTarjeta.css";
import Header from './ComponenteHeader';
import Footer from './Footer';
import Tarjetas from '../assets/imagenes/toppng.com-visa-mastercard-american-express-logos-american-express-1530x261.png';


const ComponentePagoTarjeta = () => {
  const navigate = useNavigate();

  // Estados para manejar la información de envío y tarjeta
  const [envio, setEnvio] = useState({
    nombreUsuario: '',
    calleNumero: '',
    municipio: '',
    estado: '',
    pais: '',
    codigoPostal: ''
  });

  const [tarjeta, setTarjeta] = useState({
    numero: '',
    fechaCaducidad: '',
    codigoSeguridad: '',
    recordarTarjeta: false
  });

  const [showForm, setShowForm] = useState(false);
  const [resumenPedido, setResumenPedido] = useState({
    gastoEnvio: 5,
    total: 0
  });

  useEffect(() => {
    // Cargar la información del total del local storage
    const totalCompra = JSON.parse(localStorage.getItem('totalCompra')) || { subtotal: 0, iva: 0, total: 0 };
    setResumenPedido(prevState => ({
      ...prevState,
      precioVenta: totalCompra.subtotal,
      total: totalCompra.subtotal + totalCompra.iva + prevState.gastoEnvio
    }));
  
    
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const iva = parseFloat(localStorage.getItem('iva')) || 0;
    const total = parseFloat(localStorage.getItem('total')) || 0;
    
    // Cargar la dirección de envío guardada
    const envioGuardado = JSON.parse(localStorage.getItem('envio'));
    if (envioGuardado) {
      setEnvio(envioGuardado);
    }

    // Cargar la tarjeta guardada
    const tarjetaGuardada = JSON.parse(localStorage.getItem('tarjeta'));
    if (tarjetaGuardada) {
      setTarjeta(tarjetaGuardada);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnvio(prevEnvio => ({
      ...prevEnvio,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Guardar los datos de envío en el local storage
    localStorage.setItem('envio', JSON.stringify(envio));
    setShowForm(false);
  };

  // Funciones para manejar cambios en los campos
  const handleEnvioChange = (e) => {
    const { name, value } = e.target;
    setEnvio(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTarjetaChange = (e) => {
    const { name, value, type } = e.target;
    setTarjeta(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleGuardarTarjeta = (e) => {
    e.preventDefault();
    // Guardar los datos de la tarjeta en el local storage
    localStorage.setItem('tarjeta', JSON.stringify(tarjeta));
  };

  // Función para mostrar ejemplos en los campos
  const mostrarEjemplo = () => {
    setEnvio({
      nombreUsuario: 'Juan Pérez',
      calleNumero: 'Av. Principal 123',
      municipio: 'Ciudad Capital',
      estado: 'Estado de Ejemplo',
      pais: 'País de Ejemplo',
      codigoPostal: '12345'
    });


  const handlePagar = () => {
      // Mostrar animación de pago aceptado
      alert('Pago aceptado. Gracias por su compra.');
      // Redirigir a carrito vacío
      localStorage.removeItem('carrito');
      localStorage.removeItem('totalCompra');
      window.location.href = '/carrito';
    };  


    setTarjeta({
      numero: '1234 5678 9012 3456',
      fechaCaducidad: '12/24',
      codigoSeguridad: '123',
      recordarTarjeta: true
    });
  };


  return (
    <div>
      <Header />
      <div className="contenedor-cuadros" style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Columna izquierda */}
        <div style={{ flex: 2 }}>
          {/* Cuadro 1: Dirección de envío */}
          <div className='cuadro1' style={{ width: '100%', border: '1px solid black', padding: '10px' }}>
            <h2>Dirección de envío</h2><br />
            <p>Nombre del usuario: {envio.nombreUsuario}</p>
            <p>Calle y Número: {envio.calleNumero}</p>
            <p>Municipio: {envio.municipio}</p>
            <p>Estado: {envio.estado}</p>
            <p>País: {envio.pais}</p>
            <p>Código postal: {envio.codigoPostal}</p>
            <button className='botonSelect' onClick={() => setShowForm(true)}>Seleccionar/Editar</button>
            {showForm && (
              <form onSubmit={handleFormSubmit} style={{ marginTop: '10px' }}>
                <label>Nombre del Usuario:
                  <input type="text" name="nombreUsuario" value={envio.nombreUsuario} onChange={handleEnvioChange} required />
                </label><br />
                <label>Calle y Número:
                  <input type="text" name="calleNumero" value={envio.calleNumero} onChange={handleEnvioChange} required />
                </label><br />
                <label>Municipio:
                  <input type="text" name="municipio" value={envio.municipio} onChange={handleEnvioChange} required />
                </label><br />
                <label>Estado:
                  <input type="text" name="estado" value={envio.estado} onChange={handleEnvioChange} required />
                </label><br />
                <label>País:
                  <input type="text" name="pais" value={envio.pais} onChange={handleEnvioChange} required />
                </label><br />
                <label>Código Postal:
                  <input type="text" name="codigoPostal" value={envio.codigoPostal} onChange={handleEnvioChange} required />
                </label><br />
                <button type="submit">Guardar Dirección</button>
              </form>
            )}
          </div>
          <br /><br />

          {/* Cuadro 2: Información de tarjeta */}
          <div className='cuadro2' style={{ width: '100%', border: '1px solid black', padding: '20px' }}>
            <h2>Información de tarjeta</h2><br />
            <img src={Tarjetas} className="imagen-tarjeta" alt="Tarjetas Aceptadas"></img>
            {/* Formulario de tarjeta */}
            <form onSubmit={handleGuardarTarjeta}>
              <div>
                <label htmlFor="numeroTarjeta">Número de tarjeta:</label>
                <input className='tarjeta'
                  type="text"
                  id="numeroTarjeta"
                  name="numero"
                  value={tarjeta.numero}
                  onChange={handleTarjetaChange}
                  maxLength="16"
                  placeholder="Ingrese el número de tarjeta"
                  required
                />
              </div>
              <div>
                <label htmlFor="fechaCaducidad">Fecha de caducidad:</label>
                <input className='tarjeta'
                  type="text"
                  id="fechaCaducidad"
                  name="fechaCaducidad"
                  value={tarjeta.fechaCaducidad}
                  onChange={handleTarjetaChange}
                  maxLength="5"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div> 
                <label htmlFor="codigoSeguridad">Código de seguridad:</label>
                <input className='tarjeta'
                  type="text"
                  id="codigoSeguridad"
                  name="codigoSeguridad"
                  value={tarjeta.codigoSeguridad}
                  onChange={handleTarjetaChange}
                  maxLength="3"
                  placeholder="CVC"
                  required
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="recordarTarjeta"
                    checked={tarjeta.recordarTarjeta}
                    onChange={handleTarjetaChange}
                  />
                  Recordar tarjeta
                </label>
              </div>
              <button type="submit">Guardar tarjeta</button>
            </form>
          </div><br /><br />
        </div>
        
        <div style={{ flex: 1, marginLeft: '500px' }}>
          {/* Cuadro 3: Resumen del pedido */}
          <div>
            <div className="cuadro3" style={{ width: '100%', height: '512px', border: '1px solid black', padding: '20px' }}>
              <h2>Resumen del pedido</h2><br />
              <p>Precio de venta: ${resumenPedido.total}</p>
              <p>Gasto de envío: ${resumenPedido.gastoEnvio}</p>
              <hr style={{ borderWidth: '10px', width: '100%', borderColor: "black" }} />
              <p>Total: ${resumenPedido.total + resumenPedido.gastoEnvio}</p>
            </div><br />
          </div>
          {/* Botones */}
          <div>
            <button className='cancelar' onClick={() => window.location.reload()}>Cancelar</button>
            <button className='pagar' onClick={() => {
              const paymentContainer = document.createElement('div');
              paymentContainer.classList.add('payment-success-container');
              paymentContainer.innerHTML = `
                <div class="payment-success">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="48px" height="48px">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h3>Pago aceptado</h3>
                  <p>Gracias por su compra.</p>
                </div>`;
              document.body.appendChild(paymentContainer);
              setTimeout(() => {
                paymentContainer.remove();
                localStorage.removeItem('carrito');
                localStorage.removeItem('totalCompra');
                navigate('/carrito');
              }, 3000);
            }}>Pagar</button>
          </div>
        </div>
      </div>
      {/* Botón para mostrar ejemplos */}
      <button onClick={mostrarEjemplo}>Mostrar Ejemplo</button>
      <Footer />
    </div>
  );

};

export default ComponentePagoTarjeta;
