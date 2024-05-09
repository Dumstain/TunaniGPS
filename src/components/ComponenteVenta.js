import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/animaciones-style.css";
import "../../src/styles/apartado-venta-style.css";

const ComponenteVenta = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [cooperativaId, setCooperativaId] = useState(null);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState(false);

    const fetchCooperativaIdAndVentas = async (fechaInicio = "", fechaFin = "") => {
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) {
            setError("No se encontró el ID del usuario en localStorage");
            setIsLoading(false);
            return;
        }

        try {
            const responseCooperativa = await axios.get(
                `http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`
            );
            if (responseCooperativa.data.id) {
                setCooperativaId(responseCooperativa.data.id);
                let url = `http://127.0.0.1:8000/api/cooperativas/${responseCooperativa.data.id}/ventas/?estado=entregado`;

                if (fechaInicio && fechaFin) {
                    url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
                }

                const responseVentas = await axios.get(url);
                setVentas(responseVentas.data);
            } else {
                setError("No hay ID de cooperativa asociada con este usuario");
            }
        } catch (error) {
            console.error("Error al cargar la cooperativa y las ventas:", error);
            setError(
                "Hubo un error al cargar las ventas de la cooperativa: " +
                error.message
            );
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchCooperativaIdAndVentas();
    }, []);

    const handleFechaInicioChange = (e) => {
        setFechaInicio(e.target.value);
    };

    const handleFechaFinChange = (e) => {
        setFechaFin(e.target.value);
    };

    const handleFiltroChange = () => {
        setEstadoFiltro(!estadoFiltro);
    };

    const handleFiltrar = () => {
        fetchCooperativaIdAndVentas(fechaInicio, fechaFin);
    };

    return (
        <div className="contenedor-ventas">
            <h2 id="titulo-ventas">Ventas Entregadas</h2>

            <div className="filtro-fechas">
                <label>
                    <input
                        type="checkbox"
                        checked={estadoFiltro}
                        onChange={handleFiltroChange}
                    />
                    Filtrar por fecha
                </label>
                {estadoFiltro && (
                    <div>
                        <label>
                            Fecha Inicio:
                            <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} />
                        </label>
                        <label>
                            Fecha Fin:
                            <input type="date" value={fechaFin} onChange={handleFechaFinChange} />
                        </label>
                        <button onClick={handleFiltrar}>Aplicar Filtro</button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div id="cargando"></div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : !ventas.length ? (
                <div>No hay ventas registradas para esta cooperativa.</div>
            ) : (
                ventas.map((venta) => (
                    <div className="datos-venta-contenedor" key={venta.id}>
                        <div className="informacion-general">
                            <div className="titulos-seccion">
                                <h3>Folio de Venta: {venta.id}</h3>
                            </div>
                            <p><b>Fecha:</b> {venta.fecha}</p>
                            <p><b>Hora:</b> {venta.hora}</p>
                            <p><b>Número de Seguimiento:</b> {venta.numero_seguimiento}</p>
                            <p><b>Número de Pago:</b> {venta.numero_pago}</p>
                            <p><b>Método de Pago:</b> {venta.metodo_pago}</p>
                            <br></br>
                            <div className="titulos-seccion">
                                <h3>Productos vendidos</h3>
                            </div>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {venta.detalles.map((detalle) => (
                                    <li key={detalle.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                        <strong>Producto:</strong> {detalle.producto.nombre} ({detalle.cantidad})<br />
                                        <strong>Precio:</strong> ${detalle.precio.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                            <br></br>

                            <p><b>Total de la venta: </b>${venta.precio_venta} MXN</p>
                            <p><b>Gasto de Envío: </b>${venta.gasto_envio} MXN</p>
                            <p><b>Subtotal: </b>${venta.subtotal} MXN</p>
                            <p><b>Total: </b>${venta.total_sn} MXN</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ComponenteVenta;
