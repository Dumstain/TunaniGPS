import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/perfil_representante_style.css";
import "../../src/styles/animaciones-style.css";

const PerfilRepresentante = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    materno: "",
    paterno: "",
    email: "",
    tel: "",
    ine: "",
    metodo_pago: "",
    notificaciones: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // Estado para mensajes de alerta

  useEffect(() => {
    const representanteId = localStorage.getItem("userId");
    if (!representanteId) {
      setError("No se encontró el ID del usuario en localStorage");
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:8000/api/usuario/representante/${representanteId}/`
      )
      .then((response) => {
        const data = response.data;
        setFormData({
          nombre: data.datos.nombre,
          materno: data.datos.materno,
          paterno: data.datos.paterno,
          email: data.email,
          tel: data.datos.tel,
          ine: data.datos.ine,
          metodo_pago: data.datos.metodo_pago,
          notificaciones: data.datos.notificaciones,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar los datos del perfil del representante");
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const representanteId = localStorage.getItem("userId");
    setLoading(true); // Activar loading

    // Validación de campos llenos y formato adecuado
    const { nombre, materno, paterno, email, tel, ine, metodo_pago } = formData;

    if (
      !nombre ||
      !materno ||
      !paterno ||
      !email ||
      !tel ||
      !ine ||
      !metodo_pago
    ) {
      mostrarMensaje("error", "Por favor, llena todos los campos.");
      setLoading(false);
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje(
        "error",
        "El formato del correo electrónico no es válido."
      );
      return false;
    }

    if (!/^\d+$/.test(tel) || tel.length !== 10) {
      mostrarMensaje(
        "error",
        "El número de teléfono debe contener 10 dígitos numéricos."
      );
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(ine) || ine.length !== 18) {
      mostrarMensaje("error", "El INE debe contener 18 dígitos numéricos.");
      setLoading(false);
      return;
    }

    // Si todas las validaciones son correctas, procede a enviar los datos
    const updateData = {
      nombre_user: email, // Asume que quieres actualizar el nombre de usuario al correo
      email: email,
      datos: {
        nombre: nombre,
        materno: materno,
        paterno: paterno,
        tel: tel,
        ine: ine,
        metodo_pago: metodo_pago,
        notificaciones: formData.notificaciones,
      },
    };

    axios
      .patch(
        `http://localhost:8000/api/usuario/representante/${representanteId}/`,
        updateData
      )
      .then(() => {
        mostrarMensaje(
          "success",
          "Información de representante actualizada con éxito."
        );
        setIsEditing(false);
        
      })
      .catch((err) => {
        mostrarMensaje(
          "error",
          "Error al actualizar los datos del perfil del representante."
        );
      })
      .finally(() => {
        setLoading(false); // Desactivar loading
      });
  };

  const mostrarMensaje = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // El mensaje desaparecerá después de 3 segundos
  };

  if (loading) return <div id="cargando"></div>;
  if (error) return <p>Error al cargar: {error}</p>;

  return (
    <div className="perfil-representante-container">
      <h1 className="titulo-perfil-representante">Perfil del Representante</h1>

      {!isEditing ? (
        <div>
          <div className="perfil-representante-datos-container">
            {Object.entries(formData).map(([key, value]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {key === "notificaciones" ? (value ? "Activadas 🔔" : "Desactivadas 🔕") : value.toString()}              </p>
            ))}
            <div className="acciones-formulario">
              <button onClick={handleEdit}>✎ Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="perfil-representante-form">
          <div className="formulario-editar-perfil-representante">
            {Object.keys(formData).map((key) => (
              <div key={key} className="editar-datos-perfil-representante">
                <label>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  {key !== "notificaciones" && (
                    <span title="Este campo es obligatorio"> *</span>
                  )}

                </label>

                {key === "notificaciones" ? (
                  <div>
                    <input
                      type="checkbox"
                      id={`checkbox-${key}`}
                      name={key}
                      checked={formData[key]}
                      onChange={handleChange}
                      style={{ display: "none" }} // Oculta el checkbox real
                    />
                    <label
                      htmlFor={`checkbox-${key}`}
                      className="checkbox-custom"
                    ></label>{" "}
                    {/* Visual representation */}
                  </div>
                ) : key === "metodo_pago" ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                  >
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Depósito">Depósito</option>
                  </select>
                ) : (
                  <input
                    type={key === "email" ? "email" : "text"}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    onInput={
                      key === "tel" || key === "ine"
                        ? (e) =>
                        (e.target.value = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        ))
                        : key === "nombre" ||
                          key === "materno" ||
                          key === "paterno"
                          ? (e) =>
                          (e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""))
                          : null
                    }
                    maxLength={
                      key === "tel" ? 10 : key === "ine" ? 18 : undefined
                    }
                    disabled={key === "email"}  // Desactiva la edición del email
                  />
                )}
              </div>
            ))}
            <div className="acciones-formulario">
              <button type="submit">✔ Confirmar Cambios</button>
              <button type="button" onClick={() => {
                setIsEditing(false);  // Desactiva el modo de edición

                window.location.reload();  // Recarga la página

                }}>
                🗙 Cancelar
              </button>

            </div>
          </div>
        </form>
      )}

      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          <p>{alertMessage.message}</p>
        </div>
      )}
    </div>
  );
};

export default PerfilRepresentante;
