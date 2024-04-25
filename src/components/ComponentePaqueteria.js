import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../src/styles/animaciones-style.css';
import '../../src/styles/apartado-paqueteria-style.css';


const ComponentePaqueteria = () => {
    const [paqueteria, setPaqueteria] = useState({
        nombre: '',
        estado: '',
        municipio: '',
        colonia: '',
        calle: '',
        num_ext: '',
        tel: '',
        email: '',
        servicio_ofrecido: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);  // Estado para la animación de carga
    const [error, setError] = useState('');       // Estado para manejar los errores
    const [alertMessage, setAlertMessage] = useState(null);  // Estado para mensajes de alerta

    useEffect(() => {
        const fetchCooperativaAndPaqueteria = async () => {
            const usuarioId = localStorage.getItem("userId");
            if (!usuarioId) {
                mostrarMensaje("error", "No se encontró el ID del usuario en localStorage");
                setLoading(false);
                return;
            }

            try {
                const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                const cooperativaId = responseCooperativa.data.id;
                const responsePaqueteria = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`);
                setPaqueteria(responsePaqueteria.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar la información de la cooperativa o la paquetería:", error);
                mostrarMensaje("error", "Hubo un error al cargar la información de la paquetería");
                setLoading(false);
            }
        };

        fetchCooperativaAndPaqueteria();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaqueteria({ ...paqueteria, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const usuarioId = localStorage.getItem("userId");
            const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
            const cooperativaId = responseCooperativa.data.id;
            await axios.patch(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`, paqueteria);
            setIsEditing(false);
            mostrarMensaje("success", "Información de paquetería actualizada con éxito.");
        } catch (error) {
            console.error("Error al actualizar la información de la paquetería:", error);
            mostrarMensaje("error", "Hubo un error al actualizar la información de la paquetería");
        } finally {
            setLoading(false);
        }
    };

    const mostrarMensaje = (type, message) => {
        setAlertMessage({ type, message });
        setTimeout(() => {
            setAlertMessage(null);
        }, 3000); // El mensaje desaparecerá después de 3 segundos
    };

    if (loading) return <div id="cargando"></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='apartado-paqueteria-container'>
            <h2 id='titulo-paqueteria'>Información de la Paquetería</h2>
            {isEditing ? (
                <div className='formulario-paqueteria-container'>
                <form onSubmit={handleSubmit} >
                    {/* Campos del formulario para editar */}
                    {Object.entries(paqueteria).map(([key, value]) => {
                        if (key !== 'id') {
                            return (
                                <div key={key} className='editar-datos-paqueteria'>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                    <input
                                        type={key === 'email' ? 'email' : 'text'}
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div className='acciones-formulario'>
                        <button type="submit">Guardar Cambios</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </form>
                </div>
            ) : (
                <div className='formulario-paqueteria-container'>
                    {Object.entries(paqueteria).map(([key, value]) => {
                        if (key !== 'id') {
                            return <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>;
                        }
                        return null;
                    })}
                    <div className='acciones-formulario'>
                        <button onClick={handleEdit}>Editar</button>
                    </div>
                </div>
            )}
            {alertMessage && (
                <div className={`alert ${alertMessage.type}`}>
                    <p>{alertMessage.message}</p>
                </div>
            )}
        </div>
    );
};

export default ComponentePaqueteria;
