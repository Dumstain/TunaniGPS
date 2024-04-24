import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponentePedido = ({ cooperativaId }) => {
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/cooperativas/${cooperativaId}/pedidos-en-proceso/`)
            .then(response => {
                setPedidos(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            });
    }, [cooperativaId]);

    if (isLoading) return <p>Cargando pedidos...</p>;

    return (
        <div>
            <h1>Pedidos en Proceso</h1>
            {pedidos.length ? pedidos.map(pedido => (
                <div key={pedido.id}>
                    <h2>Pedido #{pedido.id} - {pedido.estado}</h2>
                    {pedido.detalles.map((detalle, index) => (
                        <p key={index}>{detalle.producto.nombre} - Cantidad: {detalle.cantidad} - Precio: ${detalle.precio}</p>
                    ))}

                </div>
            )) : <p>No hay pedidos en proceso.</p>}
        </div>
    );
};

export default ComponentePedido;
