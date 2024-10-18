import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/perfil-cooperativa-style.css";

const ComponenteCooperativa = () => {
  const [cooperativa, setCooperativa] = useState(null);
  const [artesanos, setArtesanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null); // Para almacenar la imagen seleccionada
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // Estado para mensajes de alerta

  useEffect(() => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      setError("No se encontró el ID del usuario en localStorage");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const responseCooperativa = await axios.get(
          `https://tunaniback-0bd56842295c.herokuapp.com/api/cooperativa/${usuarioId}/`
        );
        setCooperativa(responseCooperativa.data);

        const responseArtesanos = await axios.get(
          `https://tunaniback-0bd56842295c.herokuapp.com/api/artesanos/`
        );
        setArtesanos(responseArtesanos.data);

        setLoading(false);
      } catch (err) {
        setError("Error al cargar la información: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mostrarMensaje = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // El mensaje desaparecerá después de 3 segundos
  };

  // Manejador para cambiar la imagen
  const handleImageChange = (event) => {
    setFile(event.target.files[0]); // Guarda el archivo seleccionado
  };

  // Manejador para cambiar los datos de la cooperativa
  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setCooperativa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar imagen al servidor
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("imagen", file);
      try {
        const response = await axios.post(
          `https://tunaniback-0bd56842295c.herokuapp.com/api/imagenes-cooperativa/actualizar/${cooperativa.id}/`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCooperativa((prev) => ({
          ...prev,
          imagen_url: response.data.imagen_url,
        }));
        mostrarMensaje("success", "Imagen actualizada correctamente.");
      } catch (err) {
        mostrarMensaje("error", "Error al actualizar la imagen: " + err.message);
      }
    }

    setIsImageEditing(false);
    setLoading(false);
  };

  // Enviar datos actualizados al servidor
  const handleDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validarDatos()) {
      setLoading(false);
      return; // Detiene la función si la validación falla
    }

    const usuarioId = localStorage.getItem("userId");
    try {
      const response = await axios.patch(
        `https://tunaniback-0bd56842295c.herokuapp.com/api/cooperativa/${usuarioId}/`,
        cooperativa
      );
      setCooperativa(response.data);
      mostrarMensaje("success", "Datos actualizados correctamente.");
    } catch (err) {
      mostrarMensaje("error", "Error al actualizar los datos: " + err.message);
    }

    setIsEditing(false);
    setLoading(false);
  };

  if (loading) return <div id="cargando"></div>;
  if (error) return <p>Error al cargar: {error}</p>;

  if (!cooperativa) {
    return <div>No se ha encontrado la información de la cooperativa.</div>;
  }

  // Validar los datos de la cooperativa antes de enviarlos
  const validarDatos = () => {
    if (
      !cooperativa.nombre ||
      !cooperativa.cuenta_bancaria ||
      !cooperativa.rfc ||
      !cooperativa.descripcion
    ) {
      mostrarMensaje("error", "Todos los campos son obligatorios.");
      return false;
    }
    // Validar RFC (longitud de 12 o 13 caracteres)
    if (cooperativa.rfc.length !== 12 && cooperativa.rfc.length !== 13) {
      mostrarMensaje(
        "error",
        "El RFC debe tener 12 (Persona Moral) o 13 (Persona física) caracteres."
      );
      return false;
    }
    return true;
  };

  return (
    <div className="perfil-cooperativa-container">
      <h1 id="titulo-perfil-cooperativa">Datos del Perfil de la Cooperativa</h1>

      {/* Mostrar mensajes de alerta */}
      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          <p>{alertMessage.message}</p>
        </div>
      )}

      <div id="foto-cooperativa">
        <img
          src={
            cooperativa.imagen_url ||
            "https://static.vecteezy.com/system/resources/previews/007/319/940/non_2x/group-user-profile-icon-vector.jpg"
          }
          alt="Foto Representante"
        />
      </div>
      <div className="contenedor-boton-cambiar-imagen">
        <button onClick={() => setIsImageEditing(true)}>✎ Cambiar Imagen</button>
      </div>
      <h1 id="titulo-nombre-cooperativa">🙚 Cooperativa {cooperativa.nombre} 🙙</h1>

      {/* Formulario para actualizar la imagen */}
      {isImageEditing && (
        <form onSubmit={handleImageSubmit}>
          <div className="contenedor-cambiar-imagen">
            <div id="titulo-actualizar-foto">
              <h3>Actualizar foto de la Cooperativa</h3>
              <p>Arrastre una foto al recuadro punteado o haga clic en él</p>
            </div>
            <div className="contenedor-subir-imagen">
              <input type="file" onChange={handleImageChange} />
            </div>

            <div className="botones-acciones-formulario">
              <button type="submit">🖫 Guardar Imagen</button>
              <button type="button" onClick={() => setIsImageEditing(false)}>✖ Cancelar</button>
            </div>
          </div>
        </form>
      )}

      {/* Formulario para editar los datos de la cooperativa */}
      {!isEditing ? (
        <div className="perfil-cooperativa-datos-container">
          <div className="informacion-cooperativa">
            <p><strong>Nombre:</strong> {cooperativa.nombre}</p>
            <p><strong>Cuenta Bancaria:</strong> {cooperativa.cuenta_bancaria}</p>
            <p><strong>RFC:</strong> {cooperativa.rfc}</p>
            <p><strong>Descripción:</strong></p>
            <p id="parrafo-informacion-cooperativa">"{cooperativa.descripcion}"</p>
          </div>
          <div className="botones-acciones-formulario">
            <button onClick={() => setIsEditing(true)}>✎ Editar Datos</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleDataSubmit}>
          <div className="editar-datos-container-perfil-cooperativa">
            <div id="titulo-actualizar-datos">
              <h3>Editar Información de la Cooperativa</h3>
            </div>
            <label>Nombre<span title="Este campo es obligatorio"> *</span></label>
            <input
              type="text"
              name="nombre"
              value={cooperativa.nombre || ""}
              onChange={handleDataChange}
              required
            />
            <label>Cuenta Bancaria<span title="Este campo es obligatorio"> *</span></label>
            <input
              type="text"
              name="cuenta_bancaria"
              value={cooperativa.cuenta_bancaria || ""}
              maxLength={20}
              onChange={handleDataChange}
              required
            />
            <label>RFC<span title="Este campo es obligatorio"> *</span></label>
            <input
              type="text"
              name="rfc"
              value={cooperativa.rfc || ""}
              maxLength={13}
              onChange={handleDataChange}
              required
            />
            <label>Descripción<span title="Este campo es obligatorio"> *</span></label>
            <textarea
              name="descripcion"
              value={cooperativa.descripcion || ""}
              onChange={handleDataChange}
              required
            />
            <div className="botones-acciones-formulario">
              <button type="submit">✔ Confirmar Cambios</button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false); // Desactiva el modo de edición
                }}
              >
                🗙 Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Miembros de la cooperativa */}
      <div className="perfil-cooperativa-datos-container">
        <div id="titulo-miembros-cooperativa">
          <h3>Miembros de la Cooperativa</h3>
        </div>
        <div className="miembros-container">
          {artesanos.map((artesano) => (
            <div key={artesano.id} className="integrante">
              <img
                src={
                  artesano.fotoUrl ||
                  "https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain"
                }
                alt="Foto del artesano"
              />
              <p className="nombre-integrante">{artesano.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponenteCooperativa;