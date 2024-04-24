import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponenteGestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id: '',
        nombre: '',
        precio: '',
        descripcion: '',
        material: '',
        stock: '',
        estado: 'no_publicado',
        artesano: '',
        categoria: '',  // Asegurándonos de manejar el estado inicial de la categoría
        imagen: null
    });
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

    const obtenerImagenesProducto = async (productoId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/producto/${productoId}/imagenes/`);
            return response.data.images; // Asume que la respuesta es un objeto con un campo 'images' que es un array de URLs
        } catch (error) {
            console.error('Error al obtener imágenes:', error.response.data);
            return []; // Retorna un arreglo vacío si hay un error
        }
    };
    
    const obtenerProductos = async () => {
        try {
            const resultado = await axios.get('http://127.0.0.1:8000/api/productos/');
            const productosConImagenes = await Promise.all(resultado.data.map(async producto => {
                const imagenes = await obtenerImagenesProducto(producto.id);
                return { ...producto, imagenes };
            }));
            setProductos(productosConImagenes);
        } catch (error) {
            console.error('Error al obtener productos:', error.response.data);
        }
    };

    const manejarCambio = (e) => {
        const { name, files, value } = e.target;
        if (name === 'imagen') {
            setProductoActual(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else {
            setProductoActual(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    
    const agregarProducto = async () => {
        if (!productoActual.artesano) {
            alert('Por favor, seleccione un artesano.');
            return;
        }
        const formData = new FormData();
        Object.keys(productoActual).forEach(key => {
            if (key !== 'imagen') { // Excluye el campo de imagen aquí
                formData.append(key, productoActual[key]);
            }
        });
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/productos/crear/', formData);
            obtenerProductos();  // Recargar la lista después de la adición
            if (productoActual.imagen) {
                subirImagen(response.data.id); // Asumiendo que la API devuelve el ID del producto creado
            }
        } catch (error) {
            console.error('Error al crear producto:', error.response.data);
        }
    };
    
    const subirImagen = async (productoId) => {
        const formData = new FormData();
        formData.append('imagen', productoActual.imagen, productoActual.imagen.name);
        formData.append('producto', productoId);  // Ensure product ID is included
    
        try {
            await axios.post('http://127.0.0.1:8000/api/subir-foto/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error al subir imagen:', error.response.data);
        }
    };
    

    const editarProducto = async () => {
        const formData = new FormData();
        Object.entries(productoActual).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await axios.put(`http://127.0.0.1:8000/api/productos/modificar/${productoActual.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        obtenerProductos();  // Recargar la lista después de la edición
    };

    const seleccionarParaEditar = (producto) => {
        setProductoActual(producto);
        setModoEdicion(true);
    };

    const borrarProducto = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/productos/borrar/${id}/`);
        obtenerProductos();  // Recargar la lista después del borrado
    };



    return (
        <div>
            <h2>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h2>
            <input name="nombre" value={productoActual.nombre} onChange={manejarCambio} placeholder="Nombre" />
            <input type="number" name="precio" value={productoActual.precio} onChange={manejarCambio} placeholder="Precio" />
            <input name="descripcion" value={productoActual.descripcion} onChange={manejarCambio} placeholder="Descripción" />
            <input name="material" value={productoActual.material} onChange={manejarCambio} placeholder="Material" />
            <input type="number" name="stock" value={productoActual.stock} onChange={manejarCambio} placeholder="Stock" />
            <input name="categoria" value={productoActual.categoria} onChange={manejarCambio} placeholder="Categoría" />
            <input type="file" name="imagen" onChange={manejarCambio} />
            <div>
                <select name="estado" value={productoActual.estado} onChange={manejarCambio}>
                    <option value="publicado">Publicado</option>
                    <option value="no_publicado">No Publicado</option>
                </select>
            </div>
            <div>
            <select name="artesano" value={productoActual.artesano} onChange={manejarCambio}>
    {artesanos.map(artesano => (
        <option key={artesano.id} value={artesano.id}>
            {artesano.nombre}
        </option>
    ))}
</select>
            </div>
            <button onClick={modoEdicion ? editarProducto : agregarProducto}>
                {modoEdicion ? "Guardar Cambios" : "Agregar"}
            </button>
            <h3>Lista de Productos</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Material</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Categoría</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id}>
                            <td>{producto.nombre}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.material}</td>
                            <td>{producto.stock}</td>
                            <td>{producto.estado}</td>
                            <td>{producto.categoria}</td>
                            <td>
                {producto.imagenes && producto.imagenes.length > 0 ? (
                    producto.imagenes.map((url, index) => (
                        <img key={index} src={url} alt={`Imagen de ${producto.nombre}`} style={{ width: "100px", marginRight: "5px" }} />
                    ))
                ) : "Sin imagen"}
            </td>
                            <td>
                                <button onClick={() => seleccionarParaEditar(producto)}>Editar</button>
                                <button onClick={() => borrarProducto(producto.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComponenteGestionProductos;
