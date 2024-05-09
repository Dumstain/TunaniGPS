import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ComponenteGestionProductos.css';

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
        categoria: '',  
        imagen: null
    });
    const [artesanos, setArtesanos] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [nombreError, setNombreError] = useState('');
    const [precioError, setPrecioError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');
    const [materialError, setMaterialError] = useState('');
    const [stockError, setStockError] = useState('');
    const [categoriaError, setCategoriaError] = useState('');
    const [estadoError, setEstadoError] = useState('');

    // Estado para ordenamiento y búsqueda
const [sortField, setSortField] = useState("");
const [sortDirection, setSortDirection] = useState("asc");
const [searchTerm, setSearchTerm] = useState("");


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
            return response.data.images;
        } catch (error) {
            console.error('Error al obtener imágenes:', error.response.data);
            return [];
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
        switch (name) {
            case 'nombre':
                if (/^[a-zA-Z\s]{0,60}$/.test(value)) {
                    setNombreError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setNombreError('El nombre solo debe contener caracteres del abecedario.');
                }
                if (value.trim() !== ''){
                    setNombreError('');
                } else{
                    setNombreError('El nombre es obligatorio.');
                }
                break;
            case 'precio':
                if (/^\d{0,6}$/.test(value)) {
                    setPrecioError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setPrecioError('El precio solo puede contener hasta 6 números.');
                }
                if (value.trim() !== ''){
                    setPrecioError('');
                } else{
                    setPrecioError('El precio es obligatorio.');
                }
                break;
            case 'descripcion':
                if (value.length <= 250) {
                    setDescripcionError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setDescripcionError('La descripción debe tener como máximo 250 caracteres.');
                }
                break;
            case 'material':
                if (/^[a-zA-Z\s]{0,50}$/.test(value)) {
                    setMaterialError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setMaterialError('El material solo debe contener letras y como máximo 50 caracteres.');
                }
                if (value.trim() !== ''){
                    setMaterialError('');
                } else{
                    setMaterialError('El material es obligatorio.');
                }
                break;
            case 'stock':
                if (/^\d{0,6}$/.test(value)) {
                    setStockError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setStockError('El stock solo debe contener números y tener como máximo 6 caracteres.');
                }
                if (value.trim() !== ''){
                    setStockError('');
                } else{
                    setStockError('La cantidad de producto obligatoria.');
                }
                break;
                case 'categoria':
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                    if (value.trim() === '') {
                        setCategoriaError('La categoría es obligatoria.');
                    } else {
                        setCategoriaError('');
                    }
                    break;
                
            case 'estado':
                if (value.trim() !== '') {
                    setEstadoError('');
                    setProductoActual(prevState => ({ ...prevState, [name]: value }));
                } else {
                    setEstadoError('El estado es obligatorio.');
                }
                break;
            case 'imagen':
                setProductoActual(prevState => ({
                    ...prevState,
                    [name]: files[0]
                }));
                break;
            default:
                setProductoActual(prevState => ({
                    ...prevState,
                    [name]: value
                }));
        }
    };

// Función para ordenar la tabla
const handleSort = (field) => {
    const newSortDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newSortDirection);
  };
  
  // Función para filtrar y ordenar los productos
  const filteredAndSortedProductos = productos
    .filter((producto) =>
      Object.values(producto)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  

    const agregarProducto = async () => {
        if (!productoActual.nombre || !productoActual.precio || !productoActual.material || !productoActual.stock || !productoActual.categoria || !productoActual.estado) {
            alert('Por favor, complete todos los campos obligatorios (*) antes de agregar el producto.');
            return;
        }
        const formData = new FormData();
        Object.keys(productoActual).forEach(key => {
            if (key !== 'imagen') {
                formData.append(key, productoActual[key]);
            }
        });
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/productos/crear/', formData);
            obtenerProductos();  
            if (productoActual.imagen) {
                subirImagen(response.data.id);
            }
        } catch (error) {
            console.error('Error al crear producto:', error.response.data);
        }
    };
    
    const subirImagen = async (productoId) => {
        const formData = new FormData();
        formData.append('imagen', productoActual.imagen, productoActual.imagen.name);
        formData.append('producto', productoId);
    
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
        if (!productoActual.nombre || !productoActual.precio || !productoActual.material || !productoActual.stock || !productoActual.categoria || !productoActual.estado) {
            alert('Por favor, complete todos los campos obligatorios (*) antes de editar el producto.');
            return;
        }
        const formData = new FormData();
        Object.entries(productoActual).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await axios.put(`http://127.0.0.1:8000/api/productos/modificar/${productoActual.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
            <div className="cuadro">
                <h2>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h2><br/>
                <h4>Nombre *</h4>
                <input className="cajas" name="nombre" value={productoActual.nombre} onChange={manejarCambio} placeholder="Nombre" /><br/>
                {nombreError && <p style={{ color: 'red' }}>{nombreError}</p>}
                <h4>Precio *</h4>
                <input className="cajas" type="text" name="precio" value={productoActual.precio} onChange={manejarCambio} placeholder="Precio" /><br/>
                {precioError && <p style={{ color: 'red' }}>{precioError}</p>}
                <h4>Descripción</h4>
                <input className="cajas" name="descripcion" value={productoActual.descripcion} onChange={manejarCambio} placeholder="Descripción" /><br/>
                {descripcionError && <p style={{ color: 'red' }}>{descripcionError}</p>}
                <h4>Material *</h4>
                <input className="cajas" name="material" value={productoActual.material} onChange={manejarCambio} placeholder="Material" /><br/>
                {materialError && <p style={{ color: 'red' }}>{materialError}</p>}
                <h4>Stock *</h4>
                <input className="cajas" type="number" name="stock" value={productoActual.stock} onChange={manejarCambio} placeholder="Stock" /><br/>
                {stockError && <p style={{ color: 'red' }}>{stockError}</p>}
                <h4>Categoria *</h4>
                <input className="cajas" name="categoria" value={productoActual.categoria} onChange={manejarCambio} placeholder="Categoría" /><br/>
                {categoriaError && <p style={{ color: 'red' }}>{categoriaError}</p>}
                <input type="file" name="imagen" onChange={manejarCambio} />
                <div>
                    <h4>Estado *</h4>
                    <select className="seleccion" name="estado" value={productoActual.estado} onChange={manejarCambio}><br/>
                        <option value="publicado">Publicado</option>
                        <option value="no_publicado">No Publicado</option>
                    </select>
                    {estadoError && <p style={{ color: 'red' }}>{estadoError}</p>}
                </div>
                <div>
                    <h4>Artesano *</h4>
                    <select className="seleccion" name="artesano" value={productoActual.artesano} onChange={manejarCambio}>
                        {artesanos.map(artesano => (
                            <option key={artesano.id} value={artesano.id}>
                                {artesano.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="botones" onClick={modoEdicion ? editarProducto : agregarProducto}>
                    {modoEdicion ? "Guardar Cambios ✎" : "Agregar ✎"}
                </button>
            </div><br/>

            <h3>Lista de Productos</h3><br/>
            <div className="search-container">
  <input
    type="text"
    placeholder="Buscar..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
<table border="1">
  <thead>
    <tr>
      <th onClick={() => handleSort("nombre")}>Nombre</th>
      <th onClick={() => handleSort("precio")}>Precio</th>
      <th onClick={() => handleSort("descripcion")}>Descripción</th>
      <th onClick={() => handleSort("material")}>Material</th>
      <th onClick={() => handleSort("stock")}>Stock</th>
      <th onClick={() => handleSort("estado")}>Estado</th>
      <th onClick={() => handleSort("categoria")}>Categoría</th>
      <th>Imagen</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {filteredAndSortedProductos.map((producto) => (
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
              <img
                key={index}
                src={url}
                alt={`Imagen de ${producto.nombre}`}
                style={{ width: "100px", marginRight: "5px" }}
              />
            ))
          ) : (
            "Sin imagen"
          )}
        </td>
        <td>
          <button className="botones" onClick={() => seleccionarParaEditar(producto)}>Editar</button>
          <button className="botones" onClick={() => borrarProducto(producto.id)}>Borrar</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
    );
};

export default ComponenteGestionProductos;
