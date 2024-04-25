import React, { useState, useEffect } from "react";
import axios from 'axios';
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const representanteId = localStorage.getItem("userId");
    axios.patch(`http://localhost:8000/api/usuario/representante/${representanteId}/`, formData)
      .then(() => {
        alert('Datos actualizados correctamente.');
        setIsEditing(false);
      })
      .catch(err => {
        setError("Error al actualizar los datos del perfil del representante");
        console.error(err);
      });
  };

  if (loading) return <div id="cargando">Cargando...</div>;
  if (error) return <p>Error al cargar: {error}</p>;

  return (
    <div className="perfil-representante-container">
      <h1 className="titulo-perfil-representante">Perfil del Representante</h1>
      {!isEditing ? (
        <div>
          <button onClick={handleEdit}>Editar</button>
          <div className="perfil-representante-datos-container">
            {/* Mostrar datos aquí */}
            {Object.entries(formData).map(([key, value]) => (
              <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.toString()}</p>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="perfil-representante-form">
          <div className="perfil-representante-datos-container">
            {/* Campos para editar */}
            {Object.keys(formData).map(key => (
              <div key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type={key === 'email' ? 'email' : key === 'notificaciones' ? 'checkbox' : 'text'}
                  name={key}
                  value={key !== 'notificaciones' ? formData[key] : undefined}
                  checked={key === 'notificaciones' ? formData[key] : undefined}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PerfilRepresentante;
