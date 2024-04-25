import React, { useState, useEffect } from 'react';
import axios from 'axios';

const  ComponentePedido= () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [cooperativaId, setCooperativaId] = useState(null);

    useEffect(() => {
        const fetchCooperativaIdAndVentas = async () => {
            const usuarioId = localStorage.getItem("userId");
            if (!usuarioId) {
                setError("No se encontró el ID del usuario en localStorage");
                setIsLoading(false);
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

            setIsLoading(false);
        };

        fetchCooperativaIdAndVentas();
    }, []);

    const actualizarEstadoVenta = async (ventaId, nuevoEstado) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/ventas/${ventaId}/`, { estado: nuevoEstado });
            // Actualizar la lista de ventas con el nuevo estado
            setVentas(ventas.map(venta => venta.id === ventaId ? { ...venta, estado: nuevoEstado } : venta));
        } catch (error) {
            console.error("Error al actualizar el estado de la venta:", error);
            setError("Hubo un error al actualizar el estado de la venta: " + error.message);
        }
    };

    const cancelarVenta = async ventaId => {
        const venta = ventas.find(v => v.id === ventaId);
        if (venta && venta.estado === 'Por pagar') {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/ventas/${ventaId}/cancelar`);
                // Actualizar la lista de ventas eliminando la venta cancelada
                setVentas(ventas.filter(v => v.id !== ventaId));
            } catch (error) {
                console.error("Error al cancelar la venta:", error);
                setError("Hubo un error al cancelar la venta: " + error.message);
            }
        }
    };

    if (isLoading) {
        return <div>Cargando ventas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!ventas.length) {
        return <div>No hay ventas registradas para esta cooperativa.</div>;
    }

    const simularSeguimiento = (ventaId, estadoSeguimiento) => {
        setVentas(ventas.map(venta =>
            venta.id === ventaId ? { ...venta, numero_seguimiento: estadoSeguimiento } : venta
        ));
    };

    return (
        <div>
            <h2>Pedidos de la Cooperativa</h2>
            {ventas.map(venta => (
             <div key={venta.id}>
             <h3>Venta ID: {venta.id}</h3>
             <p>Fecha: {venta.fecha}</p>
             <p>Hora: {venta.hora}</p>
             <p>Precio Venta: {venta.precio_venta}</p>
             <p>Gasto de Envío: {venta.gasto_envio}</p>
             <p>Subtotal: {venta.subtotal}</p>
             <p>Total: {venta.total_sn}</p>
             <p>Estado: {venta.estado}</p>
             <p>Número de Seguimiento: {venta.numero_seguimiento}</p>
             <p>Número de Pago: {venta.numero_pago}</p>
             <p>Método de Pago: {venta.metodo_pago}</p>
                    <button onClick={() => actualizarEstadoVenta(venta.id, 'En camino')}>Actualizar a En camino</button>
                    {/* Funcionalidad de cancelación */}
                    {venta.estado === 'Por pagar' && (
                        <button onClick={() => cancelarVenta(venta.id)}>Cancelar Venta</button>
                    )}
                    <div>
                        <h4>Detalles de Venta:</h4>
                        <ul>
      {venta.detalles.map(detalle => (
  <li key={detalle.id}> {/* Asegúrate de que detalle.id sea único */}
    Producto: {detalle.producto.nombre} - Cantidad: {detalle.cantidad} - Precio: {detalle.precio}
  </li>
))}
                        </ul>
                    </div>
                    {/* Simulación de cambio de estado de seguimiento */}
                    <button onClick={() => simularSeguimiento(venta.id, 'En paquetería')}>Simular En paquetería</button>
                    <button onClick={() => simularSeguimiento(venta.id, 'En proceso de envío')}>Simular En proceso de envío</button>
                </div>
            ))}
        </div>
    );
};

export default ComponentePedido;
 