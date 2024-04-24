import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponentePaqueteria = () => {
    const [paqueteria, setPaqueteria] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCooperativaAndPaqueteria = async () => {
            const usuarioId = localStorage.getItem("userId"); // Asegúrate de que el usuarioId esté almacenado en localStorage
            if (!usuarioId) {
                setError("No se encontró el ID del usuario en localStorage");
                return;
            }

            try {
                // Primero obtenemos la cooperativa asociada al usuario
                const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                const cooperativaId = responseCooperativa.data.id;

                // Luego obtenemos la información de la paquetería usando la cooperativaId
                const responsePaqueteria = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/paqueteria/`);
                setPaqueteria(responsePaqueteria.data);
            } catch (error) {
                console.error("Error al cargar la información de la cooperativa o la paquetería:", error);
                setError("Hubo un error al cargar la información de la paquetería");
            }
        };

        fetchCooperativaAndPaqueteria();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!paqueteria) {
        return <div>Cargando información de la paquetería...</div>;
    }

    return (
        <div>
            <h2>Información de la Paquetería</h2>
            <p><strong>Nombre:</strong> {paqueteria.nombre}</p>
            <p><strong>Estado:</strong> {paqueteria.estado}</p>
            <p><strong>Municipio:</strong> {paqueteria.municipio}</p>
            <p><strong>Colonia:</strong> {paqueteria.colonia || 'No especificado'}</p>
            <p><strong>Calle:</strong> {paqueteria.calle || 'No especificado'}</p>
            <p><strong>Número Exterior:</strong> {paqueteria.num_ext || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> {paqueteria.tel}</p>
            <p><strong>Email:</strong> {paqueteria.email}</p>
            <p><strong>Servicio Ofrecido:</strong> {paqueteria.servicio_ofrecido || 'No especificado'}</p>
        </div>
    );
};

export default ComponentePaqueteria;
