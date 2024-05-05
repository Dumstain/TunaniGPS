import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/perfil-cooperativa-style.css";

const PerfilCooperativa = () => {
  const [cooperativa, setCooperativa] = useState(null);
  const [artesanos, setArtesanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      setError("No se encontró el ID del usuario en localStorage");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const responseCooperativa = await axios.get(`http://localhost:8000/api/cooperativa/${usuarioId}/`);
        setCooperativa(responseCooperativa.data);

        const responseArtesanos = await axios.get(`http://localhost:8000/api/artesanos/`);
        setArtesanos(responseArtesanos.data);

        setLoading(false);
      } catch (err) {
        setError("Error al cargar la información: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div id="cargando"></div>;
  if (error) return <p>Error al cargar: {error}</p>;

  if (!cooperativa) {
    return <div>No se ha encontrado la información de la cooperativa.</div>;
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
      <div id="enlace-cambiar-foto"><a href="#">Cambiar foto</a></div>
      <h1 id="titulo-nombre-cooperativa">Cooperativa "{cooperativa.nombre}"</h1>
      <div className="perfil-cooperativa-datos-container">
        <p className="perfil-cooperativa-datos" data-label="Cuenta Bancaria:">
          {cooperativa.cuenta_bancaria}
        </p>
        <p className="perfil-cooperativa-datos" data-label="RFC:">
          {cooperativa.rfc}
        </p>
        <p className="perfil-cooperativa-datos" data-label="Descripción:">
          {cooperativa.descripcion}
        </p>
        <p className="perfil-cooperativa-datos" data-label="Dirección:">
          {cooperativa.direccion} {cooperativa.ciudad} {cooperativa.estado} {cooperativa.pais} {cooperativa.codigo_postal} 
        </p>
        <h2>Miembros de la Cooperativa</h2>
        <div className="miembros-container">
          {artesanos.map((artesano) => (
            <div key={artesano.id} className="integrante">
              <img src="https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain" alt="Foto del artesano" />
              <p className="nombre-integrante">{artesano.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerfilCooperativa;
