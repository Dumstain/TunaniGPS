import React, { useState } from 'react';
import "../../src/styles/ComponentePagoTarjeta.css";
import Header from './ComponenteHeader';
import Footer from './Footer';
import Tarjetas from '../assets/imagenes/toppng.com-visa-mastercard-american-express-logos-american-express-1530x261.png';

const ComponentePagoTarjeta = () => {
  // Estados para manejar la información de envío y tarjeta
  const [envio, setEnvio] = useState({
    nombreUsuario: '',
    calleNumero: '',
    municipio: '',
    estado: '',
    pais: '',
    codigoPostal: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnvio(prevEnvio => ({
      ...prevEnvio,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar los datos antes de guardarlos
    console.log('Datos de envío:', envio);
    setShowForm(false);
  };

  const [tarjeta, setTarjeta] = useState({
    numero: '',
    fechaCaducidad: '',
    codigoSeguridad: '',
    recordarTarjeta: false
  });

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

  // Funciones para abrir ventana emergente de formulario
  const handleSeleccionarEnvio = () => {
    // Implementa la lógica para abrir la ventana emergente de selección de envío
    
  };

  const handleEditarEnvio = () => {
    // Implementa la lógica para abrir la ventana emergente de edición de envío
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
          <button className='botonSelect' onClick={handleSeleccionarEnvio}>Seleccionar</button>
          <button className='botonEdit' onClick={handleEditarEnvio}>Editar</button>
        </div> 
        <br /><br />

        {/* Cuadro 2: Información de tarjeta */}
        <div className='cuadro2' style={{ width: '100%', border: '1px solid black', padding: '20px' }}>
          <h2>Información de tarjeta</h2><br />
          <img src={Tarjetas}className="imagen-tarjeta"></img>
          {/* Formulario de tarjeta */}
          <form>
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
            <div >
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
        <div className ="cuadro3"style={{ width: '100%', height: '512px', border: '1px solid black', padding: '20px' }}>
          <h2>Resumen del pedido</h2><br />

          <p>Precio de venta: $50</p>
          <p>Gasto de envío: $5</p>
          <p>Total: $55</p>
          <hr style={{ borderWidth: '10px', width: '100%', borderColor: "black" }} />
          <p>Subtotal: $55</p>
        </div><br />
      </div>
        {/* Botones */}
          <div>
            <button className='cancelar'>Cancelar</button>
            <button className='pagar'>Pagar</button>
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