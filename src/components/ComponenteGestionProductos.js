import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponenteGestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState({ id: '', nombre: '', precio: '', descripcion: '', material: '', stock: '', estado: 'no_publicado', artesano: '' });
    const [artesanos, setArtesanos] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);


    useEffect(() => {
        obtenerProductos();
        cargarArtesanos();
    }, []);

    const cargarArtesanos = async () => {
        const resultado = await axios.get('http://127.0.0.1:8000/api/artesanos/');
        setArtesanos(resultado.data);
    };

    const obtenerProductos = async () => {
        const resultado = await axios.get('http://127.0.0.1:8000/api/productos/');
        setProductos(resultado.data);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setProductoActual(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    

    const agregarProducto = async () => {
        await axios.post('http://127.0.0.1:8000/api/productos/crear/', productoActual);
        setProductoActual({ id: '', nombre: '', precio: '', descripcion: '', material: '', stock: '' });
        obtenerProductos();
    };

    const editarProducto = async () => {
        await axios.put(`http://127.0.0.1:8000/api/productos/modificar/${productoActual.id}/`, productoActual);
        setProductoActual({ id: '', nombre: '', precio: '', descripcion: '', material: '', stock: '' });
        setModoEdicion(false);
        obtenerProductos();
    };

    const seleccionarParaEditar = (producto) => {
        setProductoActual(producto);
        setModoEdicion(true);
    };

    const borrarProducto = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/productos/borrar/${id}/`);
        obtenerProductos();
    };

    return (
        <div>
            <h2>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h2>
            <input name="nombre" value={productoActual.nombre} onChange={manejarCambio} placeholder="Nombre" />
            <input type="number" name="precio" value={productoActual.precio} onChange={manejarCambio} placeholder="Precio" />
            <input name="descripcion" value={productoActual.descripcion} onChange={manejarCambio} placeholder="Descripción" />
            <input name="material" value={productoActual.material} onChange={manejarCambio} placeholder="Material" />
            <input type="number" name="stock" value={productoActual.stock} onChange={manejarCambio} placeholder="Stock" />
            <div>
    <select name="estado" value={productoActual.estado} onChange={manejarCambio}>
        <option value="publicado">Publicado</option>
        <option value="no_publicado">No Publicado</option>
    </select>
</div>
<div>
    <select name="artesano" value={productoActual.artesano} onChange={manejarCambio}>
        {artesanos.map((artesano) => (
            <option key={artesano.id} value={artesano.id}>
                {artesano.nombre} {/* Asume que tus artesanos tienen un atributo 'nombre' */}
            </option>
        ))}
    </select>
</div>
            <button onClick={modoEdicion ? editarProducto : agregarProducto}>
                {modoEdicion ? "Guardar Cambios" : "Agregar"}
            </button>

            <h3>Lista de Productos</h3>
            {productos.map((producto) => (
                <div key={producto.id}>
                    {producto.nombre} - {producto.precio}
                    <button onClick={() => seleccionarParaEditar(producto)}>Editar</button>
                    <button onClick={() => borrarProducto(producto.id)}>Borrar</button>
                </div>
            ))}
        </div>
    );
};

export default ComponenteGestionProductos;
