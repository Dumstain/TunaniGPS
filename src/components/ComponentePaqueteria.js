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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [paqueterias, setPaqueterias] = useState([]);

    useEffect(() => {
        const fetchPaqueterias = async () => {
            const userData = localStorage.getItem('user');
            const userObj = JSON.parse(userData);
            const usuarioId = userObj.id;

            if (!usuarioId) {
                mostrarMensaje("error", "No se encontró el ID del usuario en localStorage");
                setLoading(false);
                return;
            }

            try {
                const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                const cooperativaId = responseCooperativa.data.id;
                const responsePaqueterias = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`);
                setPaqueterias(responsePaqueterias.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar las paqueterías:", error);
                mostrarMensaje("error", "Hubo un error al cargar las paqueterías");
                setLoading(false);
            }
        };

        fetchPaqueterias();
    }, []);

    const handleEdit = (paqueteriaData) => {
        setPaqueteria(paqueteriaData);
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaqueteria({ ...paqueteria, [name]: value });
    };

    const validateInputs = () => {
        const { nombre, estado, municipio, tel, email } = paqueteria;
        if (!nombre || !estado || !municipio || !tel || !email) {
            mostrarMensaje("error", "Todos los campos obligatorios deben ser llenados.");
            return false;
        }
        if (!/^[0-9]{10}$/.test(tel)) {
            mostrarMensaje("error", "El teléfono debe tener 10 dígitos.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            mostrarMensaje("error", "El email no es válido.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        setLoading(true);
        const userData = localStorage.getItem('user');
        const userObj = JSON.parse(userData);
        const usuarioId = userObj.id;
        
        try {
            const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
            const cooperativaId = responseCooperativa.data.id;

            const method = paqueteria.id ? 'patch' : 'post';
            const url = `http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/${paqueteria.id ? `${paqueteria.id}/` : ''}`;
            const response = await axios[method](url, { ...paqueteria, cooperativa: cooperativaId });

            setIsEditing(false);
            setPaqueteria({
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
            mostrarMensaje("success", paqueteria.id ? "Información de paquetería actualizada con éxito." : "Paquetería añadida con éxito.");
            
            const fetchPaqueterias = async () => {
                try {
                    const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                    const cooperativaId = responseCooperativa.data.id;
                    const responsePaqueterias = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`);
                    setPaqueterias(responsePaqueterias.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error al cargar las paqueterías:", error);
                    mostrarMensaje("error", "Hubo un error al cargar las paqueterías");
                    setLoading(false);
                }
            };

            fetchPaqueterias();
        } catch (error) {
            console.error("Error al actualizar la información de la paquetería:", error);
            mostrarMensaje("error", "Hubo un error al actualizar la información de la paquetería");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setPaqueteria({
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
        setIsEditing(true);
    };

    const mostrarMensaje = (type, message) => {
        setAlertMessage({ type, message });
        setTimeout(() => {
            setAlertMessage(null);
        }, 3000);
    };

    if (loading) return <div id="cargando"></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='apartado-paqueteria-container'>
            <h2 id='titulo-paqueteria'>Información de la Paquetería</h2>
            <div>
                {paqueterias.map((item) => (
                    <div key={item.id} className='paqueteria-item'>
                        <p>{item.nombre} - {item.estado} - {item.email} - {item.tel} - {item.servicio_ofrecido}</p>
                        <button onClick={() => handleEdit(item)}>Editar</button>
                    </div>
                ))}
            </div>
            {isEditing ? (
                <div className='formulario-paqueteria-container'>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(paqueteria).map(([key, value]) => {
                            if (key !== 'id') {
                                return (
                                    <div key={key} className='editar-datos-paqueteria'>
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                        <input
                                            type={key === 'email' ? 'email' : 'text'}
                                            name={key}
                                            value={value}
                                            onChange={handleInputChange}
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
                <div>
                    <button onClick={handleAddClick}>Añadir Nueva Paquetería</button>
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
