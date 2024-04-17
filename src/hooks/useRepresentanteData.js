// src/hooks/useRepresentanteData.js
import { useState, useEffect } from 'react';

const useRepresentanteData = (representanteId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/usuario/representante/${representanteId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [representanteId]);

  return { data, loading, error };
};

export default useRepresentanteData;
