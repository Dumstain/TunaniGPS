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

  const handleImageChange = (event) => {
    setFile(event.target.files[0]); // Guarda el archivo seleccionado
  };

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setCooperativa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (file) {
      const imageFormData = new FormData();
      imageFormData.append('imagen', file);
      await axios.post(`http://localhost:8000/api/subir-foto-cooperativa/${cooperativa.id}/`, imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
          setCooperativa(prev => ({
            ...prev,
            imagen_url: response.data.imagen_url
          }));
          console.log("Imagen subida correctamente: ", response.data.imagen_url);
      }).catch(err => {
          console.error("Error al subir la imagen: ", err.message);
      });
    }

    setIsImageEditing(false);
    setLoading(false);
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const updateFormData = new FormData();
    Object.keys(cooperativa).forEach(key => {
      if (key !== 'imagen_url') { // No incluir la URL de la imagen en el formulario
        updateFormData.append(key, cooperativa[key]);
      }
    });
  
    // Usa el usuarioId directamente desde el almacenamiento local o desde el estado si ya está disponible
    const usuarioId = localStorage.getItem("userId");
    await axios.patch(`http://localhost:8000/api/cooperativa/${usuarioId}/`, updateFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        setCooperativa(response.data);  // Actualiza el estado con los datos recibidos
        console.log("Datos actualizados correctamente.");
    }).catch(err => {
        console.error("Error al actualizar los datos: ", err.message);
    });
  
    setIsEditing(false);
    setLoading(false);
};

  

  if (loading) return <div id="cargando">Cargando...</div>;
  if (error) return <p>Error al cargar: {error}</p>;

  if (!cooperativa) {
    return <div>No se ha encontrado la información de la cooperativa.</div>;
  }

  return (
    <div className="perfil-cooperativa-container">
      <h1 id="titulo-perfil-cooperativa">Datos del Perfil de la Cooperativa</h1>
      <div id="foto-cooperativa">
        <img
          src={cooperativa.imagen_url || "https://static.vecteezy.com/system/resources/previews/007/319/940/non_2x/group-user-profile-icon-vector.jpg"}
          alt="Foto Representante"
        />
      </div>
      <h1 id="titulo-nombre-cooperativa">{cooperativa.nombre}</h1>

      {isImageEditing && (
        <form onSubmit={handleImageSubmit}>
          <label>Imagen:</label>
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Guardar Imagen</button>
          <button type="button" onClick={() => setIsImageEditing(false)}>Cancelar</button>
        </form>
        
      
      )}
     <div className="perfil-cooperativa-datos-container">

      {!isEditing ? (
        <>

        </>
      ) : (
        <form onSubmit={handleDataSubmit}>
          {/* Campos editables */}
          <label>Nombre:</label>
          <input type="text" name="nombre" value={cooperativa.nombre || ''} onChange={handleDataChange} />
          <label>Cuenta Bancaria:</label>
          <input type="text" name="cuenta_bancaria" value={cooperativa.cuenta_bancaria || ''} onChange={handleDataChange} />
          <label>RFC:</label>
          <input type="text" name="rfc" value={cooperativa.rfc || ''} onChange={handleDataChange} />
          <label>Descripción:</label>
          <textarea name="descripcion" value={cooperativa.descripcion || ''} onChange={handleDataChange} />
          <button type="submit">Confirmar</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      )}
      
      <h2>Información de la Cooperativa</h2>
      <div className="informacion-cooperativa">
        <p><strong>Nombre:</strong> {cooperativa.nombre}</p>
        <p><strong>Cuenta Bancaria:</strong> {cooperativa.cuenta_bancaria}</p>
        <p><strong>RFC:</strong> {cooperativa.rfc}</p>
        <p><strong>Descripción:</strong> {cooperativa.descripcion}</p>
      </div>

      <h2>Miembros de la Cooperativa</h2>
      <div className="miembros-container">
        {artesanos.map(artesano => (
          <div key={artesano.id} className="integrante">
            <img src={artesano.fotoUrl || "https://th.bing.com/th/id/OIP.CGN_R3YtmCaxNFdrPQCKBQHaHT?rs=1&pid=ImgDetMain"} alt="Foto del artesano" />
            <p className="nombre-integrante">{artesano.nombre}</p>
          </div>
        ))}
      </div>
      </div>
      <button onClick={() => setIsEditing(true)}>Editar Datos</button>
      <button onClick={() => setIsImageEditing(true)}>Cambiar Imagen</button>
    </div>
    
  );
};

export default PerfilCooperativa;
