import React from "react";
import Barcode from "react-jsbarcode";
import "../styles/imprimir-datos-deposito-style.css";

export const ComponenteImprimirDatosDeposito = () => {
  // Supongamos que esta es la cadena de referencia de pago
  const datosPago = "0948839291928283";

  // Función para dividir la cadena en bloques de cuatro
  const formatearReferencia = (referencia) => {
    // Divide la cadena en grupos de cuatro caracteres
    return referencia.match(/.{1,4}/g).join(" ");
  };

  // Referencia formateada para mostrar
  const referenciaFormateada = formatearReferencia(datosPago);

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Añadir tres días a la fecha actual
  fechaActual.setDate(fechaActual.getDate() + 3);

  // Formatear la fecha como DD/MM/AAAA
  const fechaFormateada = fechaActual.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="componente-contenedor">
      <div className="informacion-deposito-contenedor" id="area-para-imprimir">
        <div className="logo-nombre-subcontenedor">
          <h3>Tunani</h3>
          <div id="linea-vertical"></div>
          <img
            title="Logo Oxxo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/1280px-Oxxo_Logo.svg.png"
            alt="Logo Oxxo"
          />
        </div>

        <div className="parrafo-subcontenedor">
          Imprime y presenta este comprobante en cualquier tienda Oxxo del país
          para realizar el pago por tu compra. Indica al cajero de la tienda el
          valor exacto que figura en el presente comprobante. De lo contrario es
          probable que no podamos validar correctamente la compra, recuerda que tienes <b>3 días para realizar el pago</b>
        </div>

        <div className="monto-subcontenedor">
          <h4>
            <b>Datos de la compra</b>
          </h4>
          <h3>
            Total: <b>${1230.89} MXN</b>
          </h3>
        </div>

        <div className="referencia-contenedor">
          <span className="titulo">Referencia:</span>
          <span className="valor">{datosPago}</span>
        </div>

        <div className="linea-horizontal"></div>

        <div className="fecha-expiracion-contenedor">
          <span className="titulo">Fecha expiración:</span>
          <span className="valor">{fechaFormateada}</span>
        </div>

        <div className="linea-horizontal"></div>

        <div className="parrafo-subcontenedor">
          Díctale al cajero el siguiente número o pídele que lea el código de
          barras:
        </div>

        <div className="parrafo-subcontenedor">
            <hr></hr>
          <h1>{referenciaFormateada}</h1>
        </div>
        <div className="parrafo-subcontenedor">
          <Barcode value={datosPago} options={{ format: "CODE128" }} />
        </div>
        <div className="botones-contenedor">
          <button id="boton-volver">Volver</button>
          <button id="boton-imprimir" onClick={handlePrint}>🖶 Imprimir</button>          
        </div>

        <div className="intrucciones-contenedor">
          <p>
            1. Imprime o presenta en el celular el recibo de pago y preséntalo
            al cajero en tu tienda OXXO más cercana.
          </p>
          <p>2. Solicita al cajero de OXXO que escanee el código de barras.</p>
          <p>
            3. El cajero de OXXO, te pedirá el pago del servicio, puedes hacerlo
            con efectivo o con tarjeta de débito o crédito (Visa o MasterCard),
            no se aceptan vales.
          </p>
          <p>
            4. Tu pago será acreditado entre uno y dos días laborables luego de
            que lo realices.
          </p>
        </div>
      </div>
    </div>
  );
};
