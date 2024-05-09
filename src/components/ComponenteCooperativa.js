import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/perfil-cooperativa-style.css";

const PerfilCooperativa = () => {
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
          `http://localhost:8000/api/cooperativa/${usuarioId}/`
        );
        setCooperativa(responseCooperativa.data);

        const responseArtesanos = await axios.get(
          `http://localhost:8000/api/artesanos/`
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

  const handleImageChange = (event) => {
    setFile(event.target.files[0]); // Guarda el archivo seleccionado
  };

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setCooperativa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("imagen", file);
      await axios
        .post(
          `http://localhost:8000/api/subir-foto-cooperativa/${cooperativa.id}/`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setCooperativa((prev) => ({
            ...prev,
            imagen_url: response.data.imagen_url,
          }));
          mostrarMensaje("success", "Imagen subida correctamente.");
        })
        .catch((err) => {
          mostrarMensaje("error", "Error al subir la imagen: " + err.message);
        });
    }

    setIsImageEditing(false);
    setLoading(false);
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validarDatos()) {
      setLoading(false);
      return; // Detiene la función si la validación falla
    }

    const updateFormData = new FormData();
    Object.keys(cooperativa).forEach((key) => {
      if (key !== "imagen_url") {
        // No incluir la URL de la imagen en el formulario
        updateFormData.append(key, cooperativa[key]);
      }
    });

    const usuarioId = localStorage.getItem("userId");
    await axios
      .patch(
        `http://localhost:8000/api/cooperativa/${usuarioId}/`,
        updateFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setCooperativa(response.data);
        mostrarMensaje("success", "Datos actualizados correctamente.");
      })
      .catch((err) => {
        mostrarMensaje(
          "error",
          "Error al actualizar los datos: " + err.message
        );
      });

    setIsEditing(false);
    setLoading(false);
  };

  if (loading) return <div id="cargando"></div>;
  if (error) return <p>Error al cargar: {error}</p>;

  if (!cooperativa) {
    return <div>No se ha encontrado la información de la cooperativa.</div>;
  }

  const validarDatos = () => {
    // Verifica si alguno de los campos requeridos está vacío
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

    // Validar cuenta bacncaria (solo números y longitud de 20 dígitos)
    //if (!/^\d{20}$/.test(cooperativa.cuenta_bancaria)) {
    //  mostrarMensaje("error", "El número de tarjeta debe tener 16 dígitos.");
    //  return false;
    //}
    return true;
  };

  return (
    <div className="perfil-cooperativa-container">
      <h1 id="titulo-perfil-cooperativa">Datos del Perfil de la Cooperativa</h1>

      {/* Agregado para mostrar mensajes */}
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
        <button onClick={() => setIsImageEditing(true)}>
          ✎ Cambiar Imagen
        </button>
      </div>
      <h1 id="titulo-nombre-cooperativa">
        🙚 Cooperativa {cooperativa.nombre} 🙙
      </h1>

      

      {isImageEditing && (
        <form onSubmit={handleImageSubmit}>
          <div className="contenedor-cambiar-imagen">
            <div id="titulo-actualizar-foto">
              <h3>Actualizar foto de la Coperativa</h3>
              <p>Arrastre una foto al recuadro punteado o haga clic en él</p>
            </div>
            <div className="contenedor-subir-imagen">
              <input type="file" onChange={handleImageChange} />
            </div>

            <div className="botones-acciones-formulario">
              <button type="submit">🖫 Guardar Imagen</button>
              <button type="button" onClick={() => setIsImageEditing(false)}>
                ✖ Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {!isEditing ? (
        <div className="perfil-cooperativa-datos-container">
          <div className="informacion-cooperativa">
            <p>
              <strong>Nombre:</strong> {cooperativa.nombre}
            </p>
            <p>
              <strong>Cuenta Bancaria:</strong> {cooperativa.cuenta_bancaria}
            </p>
            <p>
              <strong>RFC:</strong> {cooperativa.rfc}
            </p>
            <p>
              <strong>Descripción:</strong>
            </p>
            <p id="parrafo-informacion-cooperativa">
              "{cooperativa.descripcion}"
            </p>
          </div>
          <div className="botones-acciones-formulario">
            <button onClick={() => setIsEditing(true)}>✎ Editar Datos</button>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleDataSubmit}>
            <div className="editar-datos-container-perfil-cooperativa">
            <div id="titulo-actualizar-datos">
              <h3>Editar Información de la Cooperativa</h3>
            </div>
              <label>
                Nombre<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="text"
                name="nombre"
                onInput={(e) => {
                  // Permitir letras (incluyendo acentuadas y ñ), y espacios
                  e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                }} 
                value={cooperativa.nombre || ""}
                onChange={handleDataChange}
              />
              <label>
                Cuenta Bancaria<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="text"
                name="cuenta_bancaria"
                value={cooperativa.cuenta_bancaria || ""}
                maxLength={20} // Limit to 10 characters
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
                }}
                onChange={handleDataChange}
              />
              <label>
                RFC<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="text"
                name="rfc"
                value={cooperativa.rfc || ""}
                maxLength={13} // Limit to 10 characters
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                }}
                onChange={handleDataChange}
              />
              <label>
                Descripción<span title="Este campo es obligatorio"> *</span>
              </label>
              <textarea
                name="descripcion"
                value={cooperativa.descripcion || ""}
                onChange={handleDataChange}
              />

              <div className="botones-acciones-formulario">
                <button type="submit">✔ Confirmar Cambios</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false); // Desactiva el modo de edición

                    window.location.reload(); // Recarga la página
                  }}
                >
                  🗙 Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="perfil-cooperativa-datos-container">
        <div id="titulo-miembros-cooperativa">
          {" "}
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

export default PerfilCooperativa;
