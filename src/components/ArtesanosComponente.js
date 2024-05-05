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

    if (!validarCampos()) {
      return;
    }
  

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
        console.log(error);
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

  const validarCampos = () => {
    // Verificar si algún campo está vacío
    if (
      !nombre ||
      !apellido_paterno ||
      !apellido_materno ||
      !tel ||
      !email ||
      !rfc ||
      !ine ||
      !numero_tarjeta ||
      !enfoque ||
      !descripcion ||
      !cooperativaSeleccionada
    ) {
      // Mostrar mensaje de error
      mostrarMensaje("error", "Todos los campos son obligatorios.");
      return false;
    }
  
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje("error", "El formato del correo electrónico no es válido.");
      return false;
    }
  
    // Validar número de teléfono (solo números y longitud de 10 dígitos)
    if (!/^\d{10}$/.test(tel)) {
      mostrarMensaje("error", "El número de teléfono debe tener 10 dígitos.");
      return false;
    }
  
    // Validar número de INE (solo números y longitud de 13 dígitos)
    if (!/^\d{13}$/.test(ine)) {
      mostrarMensaje("error", "El número de INE debe tener 13 dígitos.");
      return false;
    }
  
    // Validar RFC (longitud de 13 caracteres)
    if (rfc.length !== 13) {
      mostrarMensaje("error", "El RFC debe tener 13 caracteres.");
      return false;
    }
  
    // Validar número de tarjeta (solo números y longitud de 16 dígitos)
    if (!/^\d{16}$/.test(numero_tarjeta)) {
      mostrarMensaje("error", "El número de tarjeta debe tener 16 dígitos.");
      return false;
    }
  
    return true;
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
        <label htmlFor="nombre" title="Este campo es obligatorio">Nombre<span> *</span></label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
      </div>
      <div className="input-group">
        <label htmlFor="apellidoPaterno" title="Este campo es obligatorio">Apellido Paterno<span> *</span></label>
        <input
          id="apellidoPaterno"
          type="text"
          value={apellido_paterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          placeholder="Apellido Paterno"
        />
      </div>
      <div className="input-group">
        <label htmlFor="apellidoMaterno" title="Este campo es obligatorio">Apellido Materno<span> *</span></label>
        <input
          id="apellidoMaterno"
          type="text"
          value={apellido_materno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
          placeholder="Apellido Materno"
        />
      </div>
      <div className="input-group">
        <label htmlFor="telefono" title="Este campo es obligatorio">Teléfono<span> *</span></label>
        <input
          id="telefono"
          type="text"
          value={tel}
          maxLength={10} // Limit to 10 characters
          onChange={(e) => setTel(e.target.value)}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
          }}
          
          placeholder="Teléfono"
        />
      </div>
      <div className="input-group">
        <label htmlFor="email" title="Este campo es obligatorio">Email<span> *</span></label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="input-group">
        <label htmlFor="rfc" title="Este campo es obligatorio">RFC<span> *</span></label>
        <input
          id="rfc"
          type="text"
          maxLength={13} // Limit to 10 characters
          value={rfc}
          onChange={(e) => setRfc(e.target.value)}
          placeholder="RFC"
        />
      </div>
      <div className="input-group">
        <label htmlFor="ine" title="Este campo es obligatorio">INE<span> *</span></label>
        <input
          id="ine"
          type="text"
          value={ine}
          maxLength={13} // Limit to 10 characters
          onChange={(e) => setIne(e.target.value)}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
          }}
          placeholder="INE"
        />
      </div>
      <div className="input-group">
        <label htmlFor="numeroTarjeta" title="Este campo es obligatorio">Número de Tarjeta<span> *</span></label>
        <input
          id="numeroTarjeta"
          type="text"
          value={numero_tarjeta}
          onChange={(e) => setNumeroTarjeta(e.target.value)}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
          }}
          placeholder="Número de Tarjeta"
          maxLength={16} // Limit to 10 characters
        />
      </div>
      <div className="input-group">
        <label htmlFor="enfoque" title="Este campo es obligatorio">Enfoque<span> *</span></label>
        <input
          id="enfoque"
          type="text"
          value={enfoque}
          onChange={(e) => setEnfoque(e.target.value)}
          placeholder="Enfoque"
        />
      </div>
      <div className="input-group">
        <label htmlFor="descripcion" title="Este campo es obligatorio">Descripción<span> *</span></label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        ></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="cooperativa" title="Este campo es obligatorio">Cooperativa<span> *</span></label>
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
