import React, { useState, useEffect } from "react";
import "../../src/styles/perfil-cooperativa-style.css";
import "../../src/styles/animaciones-style.css";

const PerfilCooperativa = () => {
  const [cooperativa, setCooperativa] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem("userId"); // Asegúrate de haber guardado el usuarioId al loguearte
    console.log("Usuario ID obtenido:", usuarioId); // Imprime el ID del usuario para verificar
    if (usuarioId) {
      fetch(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`) // Asume que tienes una API que permite esto
        .then((response) => response.json())
        .then((data) => setCooperativa(data))
        .catch((error) =>
          console.error(
            "Hubo un error al cargar la información de la cooperativa:",
            error
          )
        );
    }
  }, []);

  if (!cooperativa) {
    return <div id="cargando"></div>;
  }

  return (
    <div className="perfil-cooperativa-container">
      <h1 id="titulo-perfil-cooperativa">Datos del Perfil de la Cooperativa</h1>
      <div id="foto-cooperativa">
        <img
          src="https://static.vecteezy.com/system/resources/previews/007/319/940/non_2x/group-user-profile-icon-vector.jpg"
          alt="Foto Representante"
        />
      </div>
      <div id="enlace-cambiar-foto"><a>Cambiar foto</a></div>
      <h1 id="titulo-nombre-cooperativa">Cooperativa "{cooperativa.nombre}"</h1>
      <div className="perfil-cooperativa-datos-container">
        <p className="perfil-cooperativa-datos" data-label="Origen:">
          {}
        </p>
       
        <p className="perfil-cooperativa-datos" data-label="Cuenta Bancaria:">
          {}
        </p>
        <p className="perfil-cooperativa-datos" data-label="RFC:">
          {}
        </p>
        <p className="perfil-cooperativa-datos" data-label="Descripcion:">
          {cooperativa.descripcion}
        </p>
        <p className="perfil-cooperativa-datos" data-label="Paqueteria Asociada:">
          {}
        </p>
        
        <div id="miembros-agregar-container">
          <p className="perfil-cooperativa-datos" data-label="# Miembros: "> {'5'}</p>
          <a>Agregar Miembros</a>
        </div>
        <div className="miembros-container">
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
          <div className="integrante">
            <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="foto integrante" />
            <p className="nombre-integrante">{"nombre"}</p>
          </div> 
           

          
        </div>
      </div>
      {/* Muestra más detalles de la cooperativa como prefieras */}
    </div>
  );
};

export default PerfilCooperativa;
