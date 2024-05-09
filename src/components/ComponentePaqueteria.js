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
    const [selectedPaqueteriaId, setSelectedPaqueteriaId] = useState('');

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
    
    const handleChangePaqueteria = async () => {
        if (!selectedPaqueteriaId) {
            mostrarMensaje("error", "Selecciona una paquetería primero.");
            return;
        }

        const userData = localStorage.getItem('user');
        const userObj = JSON.parse(userData);
        const cooperativaId = userObj.cooperativaId; // Asegúrate de que este dato está disponible en localStorage

        try {
            await axios.patch(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/cambiar-paqueteria/`, {
                paqueteria_id: selectedPaqueteriaId
            });
            mostrarMensaje("success", "Paquetería actualizada con éxito.");
        } catch (error) {
            console.error("Error al cambiar la paquetería:", error);
            mostrarMensaje("error", "Hubo un error al cambiar la paquetería");
        }
    };
    
    const handleEdit = (paqueteriaData) => {
        setPaqueteria(paqueteriaData);
        setIsEditing(true);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaqueteria({ ...paqueteria, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userData = localStorage.getItem('user');
        const userObj = JSON.parse(userData);
        const usuarioId = userObj.id;
        const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
        const cooperativaId = responseCooperativa.data.id;

        try {
            const method = paqueteria.id ? 'patch' : 'post';
            const url = `http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/${paqueteria.id}/`;
            const response = await axios[method](url, paqueteria);
            setIsEditing(false);
            setPaqueteria({
                id: null,
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
        
            fetchPaqueterias();        } catch (error) {
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

    const handleEditClick = () => {
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
                <div key={item.id}>
                    <p>{item.nombre} - {item.estado}</p>
                    <button onClick={() => handleEdit(item)}>Editar</button>
                </div>
            ))}
            {isEditing ? (
                <div className='formulario-paqueteria-container'>
                <form onSubmit={handleSubmit}>
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
            <div className='apartado-paqueteria-container'>
            <h2 id='titulo-paqueteria'>Cambiar Paquetería de la Cooperativa</h2>
            <select value={selectedPaqueteriaId} onChange={(e) => setSelectedPaqueteriaId(e.target.value)}>
                <option value="">Selecciona una paquetería</option>
                {paqueterias.map((paqueteria) => (
                    <option key={paqueteria.id} value={paqueteria.id}>
                        {paqueteria.nombre}
                    </option>
                ))}
            </select>
            <button onClick={handleChangePaqueteria}>Cambiar Paquetería</button>
            {alertMessage && (
                <div className={`alert ${alertMessage.type}`}>
                    <p>{alertMessage.message}</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default ComponentePaqueteria;
