import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate desde react-router-dom
import "../../src/styles/forma-pago-style.css";
import dhlLogo from '../assets/logos_paqueterias/dhl.png';
import fedexLogo from '../assets/logos_paqueterias/FedEX.jpg';
import upsLogo from '../assets/logos_paqueterias/UPS-logo.png';
import estafetaLogo from '../assets/logos_paqueterias/estafeta.png';
import correosMexicoLogo from '../assets/logos_paqueterias/correosmexico.png';
import ComponenteHeader from '../components/ComponenteHeader';
import diablitoocumicho from '../assets/imagenes/diablitoocumicho.png';
import calaveraartesania from '../assets/imagenes/calaveraartesania.jpg';


export const ComponenteFormaPago = () => {
  const navigate = useNavigate(); // Crea una instancia del hook useNavigate
  const [envio, setEnvio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDireccion, setSelectedDireccion] = useState(null);

  useEffect(() => {
    const opcionesEnvio = [
      { nombre: "DHL - $150.00 MXN", img: dhlLogo },
      { nombre: "FedEx - $130.00 MXN", img: fedexLogo },
      { nombre: "UPS - $140.00 MXN", img: upsLogo },
      { nombre: "Estafeta - $120.00 MXN", img: estafetaLogo },
      { nombre: "Correos de México - $100.00 MXN", img: correosMexicoLogo },
    ];
    const indiceAleatorio = Math.floor(Math.random() * opcionesEnvio.length);
    setEnvio(opcionesEnvio[indiceAleatorio]);
  }, []);

  const direcciones = [
    { id: 1, usuario: "Laura Martínez", calle: "Av. Reforma 1820", municipio: "Monterrey, Nuevo León, México", codigoPostal: "64000" },
    { id: 2, usuario: "Jorge Ruiz", calle: "Calle Miramar 45", municipio: "Veracruz, Veracruz, México", codigoPostal: "91700" }
  ];

  const handleSelectDireccion = (direccion) => {
    setSelectedDireccion(direccion);
    setModalOpen(false);
  };

  const renderModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="forma-pago-modal-overlay">
        <div className="forma-pago-modal-content">
          <div className='titulo-con-selector-contenedor'>
            <h3 className="titulo-sin-accion">Seleccionar dirección de envío</h3>
            <button onClick={() => setModalOpen(false)}>✖</button>
          </div>
          {direcciones.map((direccion) => (
            <div key={direccion.id} className="forma-pago-direccion-item" onClick={() => handleSelectDireccion(direccion)}>
              <p>{direccion.usuario}</p>
              <p>{direccion.calle}</p>
              <p>{direccion.municipio}</p>
              <p>CP: {direccion.codigoPostal}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleRealizarPedido = () => {
    navigate('/datosDeposito');  // Navega a la ruta deseada
  };

  return (
    <div className="forma-pago-container">
      {renderModal()}
      <div className="principal-forma-pago-container">
        <div className="contenedor-1-pago">
          <div className="forma-pago-direccion">
            <div className='titulo-con-selector-contenedor'>
              <h3 className="titulo-sin-accion">Dirección de envío</h3>
              <button onClick={() => setModalOpen(true)}>Seleccionar dirección</button>
            </div>
            <div>
              {selectedDireccion ? (
                <>
                  <p>{selectedDireccion.usuario}</p>
                  <p>{selectedDireccion.calle}</p>
                  <p>{selectedDireccion.municipio}</p>
                  <p>{selectedDireccion.codigoPostal}</p>
                </>
              ) : (
                <p>Selecciona una dirección</p>
              )}
            </div>
          </div>
          <div className="sub-contenedor-resumen-envio">
            <div className="titulo-resumen-compra">
              <h3 className='titulo-sin-accion'>Resumen de compra</h3>
            </div>
            <div className="forma-pago-resumen">
              <div className="ficha-producto-compra">
                <img src={diablitoocumicho} alt="Diablito Ocumicho" />
                <div className='Inf-producto'>
                  <p><b>Diablito Ocumicho</b></p>
                  <p>1 pzs</p>
                  <p>$400.00 MXN</p>
                </div>
              </div>
              <div className="ficha-producto-compra">
                <img src={calaveraartesania} alt="Calavera de colores" />
                <div className='Inf-producto'>
                  <p><b>Calavera de Colores</b></p>
                  <p>1 pzs</p>
                  <p>$350.00 MXN</p>
                </div>
              </div>
            </div>
            <div className="linea"></div>
            {envio && (
              <div className="forma-pago-envio">
                <h3 className="titulo-sin-accion">Tipo de envío</h3>
                <div className='paqueteria-seleccionada-conteiner'>
                  <img src={envio.img} alt="Icono de paquetería" className="icono-paqueteria" />
                  <p>{envio.nombre}</p>
                </div>
              </div>
            )}
            <div className="linea"></div>
            <div className="forma-pago-metodo">
              <h3 className="titulo-sin-accion">Forma de pago</h3>
              <div>
                <label>
                  <input type="radio" name="pago" value="tarjeta" />
                  Tarjeta de Crédito o débito 💳︎
                  <p id="aviso-tarjeta">🛈 Por seguridad, la información de tu tarjeta no es almacenada en nuestros servidores. Los datos de la tarjeta son criptografados vía SSL y enviados en una conexión segura al procesador de pagos.</p>
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" name="pago" value="oxxo" />
                  Depósito (Oxxo) 💰︎
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="contenedor-2-pago">
          <div className="resumen-pedido">
            <div className='titulo-resumen-compra'>
              <h3 className="titulo-sin-accion">Resumen del pedido</h3>
            </div>
            <div className="detalles-pedido">
              <p>Precio de venta <span>$750.00 MXN</span></p>
              <p>Gasto de envío <span>$130.00 MXN</span></p>
              <p>Subtotal <span>$880.00 MXN</span></p>
            </div>
            <div className="linea"></div>
            <div className="subtotal">
              <p> Total <span>$1020.8 MXN</span></p>
            </div>
            <div className="acciones">
              <button id="boton-cancelar">✖ Cancelar</button>
              <button id="boton-realizar" onClick={handleRealizarPedido}>✔ Realizar pedido</button>            </div>
          </div>
        </div>
      </div>
    </div>
  );
};