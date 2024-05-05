import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../src/styles/perfil_representante_style.css';
import '../../src/styles/animaciones-style.css';

const PerfilRepresentante = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    materno: '',
    paterno: '',
    email: '',
    tel: '',
    ine: '',
    metodo_pago: '',
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

    axios.get(`http://localhost:8000/api/usuario/representante/${representanteId}/`)
      .then(response => {
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
      .catch(err => {
        setError("Error al cargar los datos del perfil del representante");
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const representanteId = localStorage.getItem("userId");
    setLoading(true); // Activar loading
  
    // Asegúrate de que los datos se envían en el formato esperado por el backend
    const updateData = {
      nombre_user: formData.email,  // Asume que quieres actualizar el nombre de usuario al correo
      email: formData.email,
      datos: {
        nombre: formData.nombre,
        materno: formData.materno,
        paterno: formData.paterno,
        tel: formData.tel,
        ine: formData.ine,
        metodo_pago: formData.metodo_pago,
        notificaciones: formData.notificaciones,
      }
    };
  
    axios.patch(`http://localhost:8000/api/usuario/representante/${representanteId}/`, updateData)
      .then(() => {
        mostrarMensaje("success", "Información de representante actualizada con éxito.");
        setIsEditing(false);
      })
      .catch(err => {
        mostrarMensaje("error", "Error al actualizar los datos del perfil del representante.");
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
              <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.toString()}</p>
            ))}
            <div className="acciones-formulario">
            <button onClick={handleEdit} >Editar</button>
            </div>

          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="perfil-representante-form">
  <div className="formulario-editar-perfil-representante">
    {Object.keys(formData).map(key => (
      <div key={key} className="editar-datos-perfil-representante">
        <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
        {key === 'notificaciones' ? (
          <div>
            <input
              type="checkbox"
              id={`checkbox-${key}`}
              name={key}
              checked={formData[key]}
              onChange={handleChange}
              style={{ display: 'none' }} // Oculta el checkbox real
            />
            <label htmlFor={`checkbox-${key}`} className="checkbox-custom"></label> {/* Visual representation */}
          </div>
        ) : (
          <input
            type={key === 'email' ? 'email' : 'text'}
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        )}
      </div>
    ))}
    <div className="acciones-formulario">
      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
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
