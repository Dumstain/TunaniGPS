import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCooperativaAndPaqueteria = async () => {
            const usuarioId = localStorage.getItem("userId");
            if (!usuarioId) {
                setError("No se encontró el ID del usuario en localStorage");
                return;
            }

            try {
                const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                const cooperativaId = responseCooperativa.data.id;
                const responsePaqueteria = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`);
                setPaqueteria(responsePaqueteria.data);
            } catch (error) {
                console.error("Error al cargar la información de la cooperativa o la paquetería:", error);
                setError("Hubo un error al cargar la información de la paquetería");
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
        try {
            const usuarioId = localStorage.getItem("userId");
            const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
            const cooperativaId = responseCooperativa.data.id;
            await axios.patch(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`, paqueteria);
            setIsEditing(false);
            alert('Información de paquetería actualizada con éxito.');
        } catch (error) {
            console.error("Error al actualizar la información de la paquetería:", error);
            setError("Hubo un error al actualizar la información de la paquetería");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!paqueteria && !isEditing) {
        return <div>Cargando información de la paquetería...</div>;
    }
    return (
        <div>
            <h2>Información de la Paquetería</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    {/* Campos del formulario para editar */}
                    {Object.entries(paqueteria).map(([key, value]) => {
                        if (key !== 'id') {  // Excluye el campo ID
                            return (
                                <div key={key}>
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
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
            ) : (
                <div>
                    {Object.entries(paqueteria).map(([key, value]) => {
                        if (key !== 'id') {  // No mostrar el ID
                            return <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>;
                        }
                        return null;
                    })}
                    <button onClick={handleEdit}>Editar</button>
                </div>
            )}
        </div>
    );
};

export default ComponentePaqueteria;
