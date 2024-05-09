import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/animaciones-style.css";
import "../../src/styles/apartado-pedidos-style.css";

const ComponentePedido = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [cooperativaId, setCooperativaId] = useState(null);
    const [estadoActual, setEstadoActual] = useState("");

    const fetchCooperativaIdAndVentas = async () => {
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
                const responseVentas = await axios.get(
                    `http://127.0.0.1:8000/api/cooperativas/${responseCooperativa.data.id}/ventas/?excluir_estado=entregado`
                );
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

    const handleCheckboxChange = async (ventaId, nuevoEstado) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/ventas/${ventaId}/update/`, {
                estado_pedido: nuevoEstado,
            });
            // Actualizar la lista de ventas con el nuevo estado
            await fetchCooperativaIdAndVentas();
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            setError(
                "Hubo un error al actualizar el estado del pedido: " + error.message
            );
        }
    };

    const handleCheckboxChangeSim = (nuevoEstado) => {
        //actualizar estado actual del pedido pero solo en la vista
        setEstadoActual(nuevoEstado);
    };

    const simularSeguimiento = (ventaId, estadoSeguimiento) => {
        setVentas(
            ventas.map((venta) =>
                venta.id === ventaId
                    ? { ...venta, numero_seguimiento: estadoSeguimiento }
                    : venta
            )
        );
    };

    const actualizarEstadoVenta = async (ventaId, nuevoEstado) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/ventas/${ventaId}/`, {
                estado: nuevoEstado,
            });
            // Actualizar la lista de ventas con el nuevo estado
            setVentas(
                ventas.map((venta) =>
                    venta.id === ventaId ? { ...venta, estado: nuevoEstado } : venta
                )
            );
        } catch (error) {
            console.error("Error al actualizar el estado de la venta:", error);
            setError(
                "Hubo un error al actualizar el estado de la venta: " + error.message
            );
        }
    };

    const cancelarVenta = async (ventaId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/ventas/${ventaId}/cancelar`);
            setVentas(ventas.filter((venta) => venta.id !== ventaId));
        } catch (error) {
            console.error("Error al cancelar la venta:", error);
            setError("Hubo un error al cancelar la venta: " + error.message);
        }
    };

    if (isLoading) {
        return <div id="cargando"></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!ventas.length) {
        return <div>No hay pedidos registrados para esta cooperativa.</div>;
    }

    return (
        <div className="pedidos-contenedor">
        <h2 id="titulo-pedidos">Pedidos de la Cooperativa</h2>

        {ventas.map((venta) => (
            
            <React.Fragment key={venta.id}>
                <div className="espacio-entre-divs"></div>

                <div className="pedidos-datos-contendor">
                    <div className="estatus-venta-pedido">
                        <div id="estado-pedido">
                            <p><span>Estado Actual del Pedido: </span> <b>{estadoActual}</b> </p>
                        </div>
                        <div id="estado-venta">
                            <p><span>Estado del Pago: </span><b>{venta.estado}</b></p>
                        </div>
                    </div>

                    <div className="venta-info-general">
                        <div className="titulos-secciones">
                            <h3>Datos Generales</h3>
                        </div>

                        <h4>Folio de Venta: {venta.id}</h4>
                        <p><b>Fecha:</b> {venta.fecha}</p>
                        <p><b>Hora:</b> {venta.hora}</p>
                        <p><b>Número de Seguimiento:</b> {venta.numero_seguimiento}</p>
                        <p><b>Número de Pago:</b> {venta.numero_pago}</p>
                        <p><b>Método de Pago:</b> {venta.metodo_pago}</p>
                        <p><b>Estado del Pedido:</b> {venta.estado_pedido}</p>
                    </div>

                    <div className="detalles-y-seguimiento-contenedor">
                        <div className="venta-detalles-pedido">
                            <div>
                                <h3 className="titulos-secciones">Artículos Pedidos</h3>
                            </div>

                            <div className="articulos-contenedor">
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {venta.detalles.map((detalle) => (
                                        <li key={detalle.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                            <strong>Producto:</strong> {detalle.producto.nombre} ({detalle.cantidad})<br />
                                            <strong>Precio:</strong> ${detalle.precio.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="contenedor-con-linea"></div>
                            <div className="totales-detalles-contenedor">
                                <p><b>Total de la venta: </b>${venta.precio_venta} MXN</p>
                                <p><b>Gasto de Envío: </b>${venta.gasto_envio} MXN</p>
                                <p><b>Subtotal: </b>${venta.subtotal} MXN</p>
                                <p><b>Total: </b>${venta.total_sn} MXN</p>
                            </div>
                        </div>

                        <div className="barra-seguimiento-contenedor">
                            <div>
                                <h3 className="titulos-secciones">Estado del Pedido</h3>
                            </div>

                            <div className="estados-contenedor">
                                <div className="estado">
                                    <input type="checkbox" onChange={() => handleCheckboxChangeSim("Preparando pedido 🕘︎")} />
                                    <p>Preparando Pedido</p>
                                </div>
                                <div className="flecha">⇩</div>

                                <div className="estado">
                                    <input type="checkbox" onChange={() => handleCheckboxChangeSim("Pedido Listo ✔")} />
                                    <p>Pedido Listo</p>
                                </div>
                                <div className="flecha">⇩</div>

                                <div className="estado">
                                    <input type="checkbox" onChange={() => handleCheckboxChangeSim("En paquetería 📦︎")} />
                                    <p>En paqueteria</p>
                                </div>
                                <div className="flecha">⇩</div>

                                <div className="estado">
                                    <input type="checkbox" onChange={() => handleCheckboxChangeSim("En proceso de envió 🖅")} />
                                    <p>En proceso de envio</p>
                                </div>

                                <div className="flecha">⇩</div>
                                <div className="estado">
                                    <input type="checkbox" onChange={() => handleCheckboxChange(venta.id, "entregado")} />
                                    <p>Entregado</p>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    {venta.estado === "Por pagar" && (
                            <button onClick={() => cancelarVenta(venta.id)}>
                                Cancelar Pedido
                            </button>
                        )}
                </div>
            </React.Fragment>
        ))}
    </div>
);};

export default ComponentePedido;