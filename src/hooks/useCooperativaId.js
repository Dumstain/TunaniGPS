import { useState, useEffect } from 'react';
import axios from 'axios';

const useCooperativaId = () => {
  const [cooperativaId, setCooperativaId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      setError("No se encontró el ID del usuario en localStorage");
      return;
    }

    const fetchCooperativaId = async () => {
      try {
        const response = await axios.get(`https://tunaniback-0bd56842295c.herokuapp.com/api/cooperativa/${usuarioId}/`);
        const cooperativaId = response.data.id;
        localStorage.setItem('cooperativaId', cooperativaId);
        setCooperativaId(cooperativaId);
      } catch (err) {
        setError("Error al cargar la cooperativa: " + err.message);
      }
    };

    fetchCooperativaId();
  }, []);

  return { cooperativaId, error };
};

export default useCooperativaId;
