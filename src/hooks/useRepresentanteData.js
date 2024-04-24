// src/hooks/useRepresentanteData.js
import { useState, useEffect } from 'react';
import axios from 'axios';


const useRepresentanteData = (representanteId) => {
  const [pedidos, setPedidos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCooperativaAndPedido = async () => {
        const usuarioId = localStorage.getItem("userId"); // Asegúrate de que el usuarioId esté almacenado en localStorage
        if (!usuarioId) {
            setError("No se encontró el ID del usuario en localStorage");
            return;
        }

        try {
            // Primero obtenemos la cooperativa asociada al usuario
            const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
            const cooperativaId = responseCooperativa.data.id;

            // Luego obtenemos la información de los pedidos usando la cooperativaId
            const responsePedidos = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/pedidos-en-proceso/`);
            setPedidos(responsePedidos.data);
        } catch (error) {
            console.error("Error al cargar la información de la cooperativa o la paquetería:", error);
            setError("Hubo un error al cargar la información de la paquetería");
        }
    };

    fetchCooperativaAndPedido();
}, []);

  return { pedidos, loading, error };
};

export default useRepresentanteData;
