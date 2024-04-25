import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponenteVenta = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState('');
    const [cooperativaId, setCooperativaId] = useState(null);

    useEffect(() => {
        const fetchCooperativaIdAndVentas = async () => {
            const usuarioId = localStorage.getItem("userId");
            if (!usuarioId) {
                setError("No se encontró el ID del usuario en localStorage");
                return;
            }

            try {
                const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
                if (responseCooperativa.data.id) {
                    setCooperativaId(responseCooperativa.data.id);
                    const responseVentas = await axios.get(`http://127.0.0.1:8000/api/cooperativas/${responseCooperativa.data.id}/ventas/`);
                    setVentas(responseVentas.data);
                } else {
                    setError("No hay ID de cooperativa asociada con este usuario");
                }
            } catch (error) {
                console.error("Error al cargar la cooperativa y las ventas:", error);
                setError("Hubo un error al cargar las ventas de la cooperativa: " + error.message);
            }
        };

        fetchCooperativaIdAndVentas();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!ventas.length) {
        return <div>No hay ventas registradas para esta cooperativa.</div>;
    }

    return (
        <div>
            <h2>Ventas de la Cooperativa</h2>
            {ventas.map(venta => (
                <div key={venta.id}>
                    <h3>Venta ID: {venta.id}</h3>
                    <p>Fecha: {venta.fecha}</p>
                    <p>Hora: {venta.hora}</p>
                    <p>Total: {venta.total_sn}</p>
                    <div>
                        <h4>Detalles de Venta:</h4>
                        <ul>
                            {venta.detalles.map(detalle => (
                                <li key={detalle.id}>
                                    Producto: {detalle.producto.nombre} - Cantidad: {detalle.cantidad} - Precio: {detalle.precio}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComponenteVenta;
