import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/apartado-artesanos-style.css";

const Artesanos = () => {
  // Estados para cada campo del modelo Artesano
  const [artesanos, setArtesanos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [rfc, setRfc] = useState("");
  const [ine, setIne] = useState("");
  const [numero_tarjeta, setNumeroTarjeta] = useState("");
  const [enfoque, setEnfoque] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Suponiendo que ya tienes un estado para la cooperativa o su ID
  const [cooperativas, setCooperativas] = useState([]);
  const [cooperativaSeleccionada, setCooperativaSeleccionada] = useState("");

  useEffect(() => {
    fetchArtesanos();
    fetchCooperativas();
  }, []);

  const fetchCooperativas = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cooperativas/");
      setCooperativas(response.data);
    } catch (error) {
      mostrarMensaje("error", "Error al obtener las cooperativas.");
    }
  };

  const fetchArtesanos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/artesanos/");
      setArtesanos(response.data);
    } catch (error) {
      mostrarMensaje("error", "Error al obtener los artesanos.");
    }
  };

  const [estaEditando, setEstaEditando] = useState(false);
  const [idArtesanoEditando, setIdArtesanoEditando] = useState(null);

  const resetearFormulario = () => {
    // Resetear todos los estados del formulario
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setTel("");
    setEmail("");
    setRfc("");
    setIne("");
    setNumeroTarjeta("");
    setEnfoque("");
    setDescripcion("");
    setCooperativaSeleccionada("");
  };

  const iniciarEdicion = (artesano) => {
    resetearFormulario();
    setNombre(artesano.nombre);
    setApellidoPaterno(artesano.apellido_paterno);
    setApellidoMaterno(artesano.apellido_materno);
    setTel(artesano.tel);
    setEmail(artesano.email);
    setRfc(artesano.rfc);
    setIne(artesano.ine);
    setNumeroTarjeta(artesano.numero_tarjeta);
    setEnfoque(artesano.enfoque);
    setDescripcion(artesano.descripcion);
    setCooperativaSeleccionada(artesano.cooperativa_id); // Asegúrate de que el backend envía este campo
    setIdArtesanoEditando(artesano.id);
    setEstaEditando(true);
    setModalIsOpen(true);  // Abre el modal para la edición
  };

  const cancelarEdicion = () => {
    setEstaEditando(false);
    setIdArtesanoEditando(null);
    // Aquí reseteamos el formulario a su estado inicial
    resetearFormulario();
  };

  const agregarOEditarArtesano = async () => {
    const nuevoArtesano = {
      nombre,
      apellido_paterno,
      apellido_materno,
      tel,
      email,
      rfc,
      ine,
      numero_tarjeta,
      enfoque,
      descripcion,
      cooperativa: cooperativaSeleccionada, // Cambiado a cooperativa_id
    };
    if (estaEditando) {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/artesanos/actualizar/${idArtesanoEditando}/`,
          nuevoArtesano
        );
        mostrarMensaje("success", "Artesano editado exitosamente.");
      } catch (error) {
        mostrarMensaje("error", "Error al editar el artesano.");
      }
    } else {
      try {
        await axios.post(
          "http://127.0.0.1:8000/api/artesanos/agregar/",
          nuevoArtesano
        );
        mostrarMensaje("success", "Artesano agregado exitosamente.");
      } catch (error) {
        mostrarMensaje("error", "Error al agregar el artesano.");
      }
    }
    resetearFormulario();
    setEstaEditando(false);
    //cerrar ventana modal al terminar la edicion
    closeModal();
    setIdArtesanoEditando(null);
    fetchArtesanos(); // Recargar la lista después de agregar o editar
  };

  const eliminarArtesano = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/artesanos/eliminar/${id}/`);
      mostrarMensaje("success", "Artesano eliminado exitosamente.");
      fetchArtesanos(); // Recargar la lista después de eliminar
    } catch (error) {
      mostrarMensaje("error", "Error al eliminar el artesano.");
    }
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    cancelarEdicion(); // Llama a cancelarEdicion si se cierra el modal
  };

  const [alertMessage, setAlertMessage] = useState(null);

  const mostrarMensaje = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // El mensaje desaparecerá después de 3 segundos
  };
  
  return (
    <div className="apartado-artesanos-container">
      <div className="titulo-boton-agregar-container">
        <h2 id="titulo-perfil-artesanos">Artesanos Registrados</h2>
        <button onClick={openModal}>Agregar Artesano</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>RFC</th>
            <th>INE</th>
            <th>Número de Tarjeta</th>
            <th>Enfoque</th>
            <th>Descripción</th>
            <th>Cooperativa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {artesanos.map((artesano) => (
            <tr key={artesano.id}>
              <td>{artesano.nombre}</td>
              <td>{artesano.apellido_paterno}</td>
              <td>{artesano.apellido_materno}</td>
              <td>{artesano.tel}</td>
              <td>{artesano.email}</td>
              <td>{artesano.rfc}</td>
              <td>{artesano.ine}</td>
              <td>{artesano.numero_tarjeta}</td>
              <td>{artesano.enfoque}</td>
              <td>{artesano.descripcion}</td>
              <td>{artesano.cooperativa}</td>
              <td>
                <button
                  id="boton-editar"
                  onClick={() => iniciarEdicion(artesano)}
                >
                  Editar
                </button>
                <button
                  id="boton-eliminar"
                  onClick={() => eliminarArtesano(artesano.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          
      {/*form para agregar y editar*/}

      {modalIsOpen && (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h2>{estaEditando ? "Editar información de Artesano" : "Agregar Nuevo Artesano"}</h2>
      <div className="formulario-agregar-editar-artesano">
      <div className="input-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
      </div>
      <div className="input-group">
        <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
        <input
          id="apellidoPaterno"
          type="text"
          value={apellido_paterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          placeholder="Apellido Paterno"
        />
      </div>
      <div className="input-group">
        <label htmlFor="apellidoMaterno">Apellido Materno:</label>
        <input
          id="apellidoMaterno"
          type="text"
          value={apellido_materno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
          placeholder="Apellido Materno"
        />
      </div>
      <div className="input-group">
        <label htmlFor="telefono">Teléfono:</label>
        <input
          id="telefono"
          type="text"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          placeholder="Teléfono"
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="input-group">
        <label htmlFor="rfc">RFC:</label>
        <input
          id="rfc"
          type="text"
          value={rfc}
          onChange={(e) => setRfc(e.target.value)}
          placeholder="RFC"
        />
      </div>
      <div className="input-group">
        <label htmlFor="ine">INE:</label>
        <input
          id="ine"
          type="text"
          value={ine}
          onChange={(e) => setIne(e.target.value)}
          placeholder="INE"
        />
      </div>
      <div className="input-group">
        <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
        <input
          id="numeroTarjeta"
          type="text"
          value={numero_tarjeta}
          onChange={(e) => setNumeroTarjeta(e.target.value)}
          placeholder="Número de Tarjeta"
        />
      </div>
      <div className="input-group">
        <label htmlFor="enfoque">Enfoque:</label>
        <input
          id="enfoque"
          type="text"
          value={enfoque}
          onChange={(e) => setEnfoque(e.target.value)}
          placeholder="Enfoque"
        />
      </div>
      <div className="input-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        ></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="cooperativa">Cooperativa:</label>
        <select
          id="cooperativa"
          value={cooperativaSeleccionada}
          onChange={(e) => setCooperativaSeleccionada(e.target.value)}
        >
          <option value="">Seleccione una cooperativa</option>
          {cooperativas.map((cooperativa) => (
            <option key={cooperativa.id} value={cooperativa.id}>
              {cooperativa.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="acciones-formulario">
        <button onClick={agregarOEditarArtesano}>
          {estaEditando ? "Confirmar Cambios" : "Agregar Artesano"}
        </button>
        <button onClick={closeModal}>Cerrar</button>
      </div>
      </div>
    </div>
  </div>
      )}

      {/* Alerta */}
      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          <p>{alertMessage.message}</p>
        </div>
      )}

    </div> 
  );
};

export default Artesanos;
