import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ComponenteGestionProductos.css";
import useCooperativaId from '../hooks/useCooperativaId'; // Importar el hook personalizado

const PerfilProducto = ({ initialProductoId }) => {
  const { cooperativaId, error: cooperativaError } = useCooperativaId();
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precio: "",
    material: "",
    stock: "",
    descripcion: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (cooperativaId) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/cooperativas/${cooperativaId}/productos/`
          );
          const productosData = response.data;
          setProductos(productosData);

          // Seleccionar el primer producto si no se proporciona `initialProductoId`
          const selectedProducto = initialProductoId
            ? productosData.find(p => p.id === initialProductoId)
            : productosData[0];

          if (selectedProducto) {
            setProducto(selectedProducto);
          } else {
            setError("No se encontró ningún producto para esta cooperativa.");
          }
          setLoading(false);
        } catch (err) {
          setError("Error al cargar la información: " + err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [cooperativaId, initialProductoId]);

  const mostrarMensaje = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleImageChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (files.length > 0) {
      const imageFormData = new FormData();
      files.forEach((file) => imageFormData.append("imagen", file));
  
      try {
        const response = await axios.post(
          `http://localhost:8000/api/productos/${producto.id}/agregar-fotos/`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducto((prev) => ({
          ...prev,
          imagenes: response.data.map(imagen => ({
            ...imagen,
            imagen_url: `${window.location.origin}${imagen.ubicacion}`
          }))
        }));
        mostrarMensaje("success", "Imágenes subidas correctamente.");
      } catch (err) {
        mostrarMensaje("error", "Error al subir las imágenes: " + err.message);
      }
    }
  
    setIsImageEditing(false);
    setLoading(false);
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateFormData = new FormData();
    Object.keys(producto).forEach((key) => {
      if (key !== "imagenes") {
        updateFormData.append(key, producto[key]);
      }
    });

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/productos/modificar/${producto.id}/`,
        updateFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducto(response.data);
      mostrarMensaje("success", "Datos actualizados correctamente.");
    } catch (err) {
      mostrarMensaje("error", "Error al actualizar los datos: " + err.message);
    }

    setIsEditing(false);
    setLoading(false);
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/productos/crear/`,
        {
          ...newProduct,
          cooperativa: cooperativaId,  // Asegúrate de incluir el ID de la cooperativa
        }
      );
      setProductos((prev) => [...prev, response.data]);
      mostrarMensaje("success", "Producto agregado correctamente.");
      setNewProduct({
        nombre: "",
        precio: "",
        material: "",
        stock: "",
        descripcion: "",
      });
    } catch (err) {
      mostrarMensaje("error", "Error al agregar el producto: " + err.message);
    }

    setLoading(false);
  };

  const handleSort = (key) => {
    const sortedProductos = [...productos].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setProductos(sortedProductos);
  };

  const borrarProducto = async (productoId) => {
    try {
      await axios.delete(`http://localhost:8000/api/productos/${productoId}/`);
      setProductos(productos.filter((prod) => prod.id !== productoId));
      mostrarMensaje("success", "Producto borrado correctamente.");
    } catch (err) {
      mostrarMensaje("error", "Error al borrar el producto: " + err.message);
    }
  };

  if (loading) return <div id="cargando"></div>;
  if (error || cooperativaError) return <p>Error al cargar: {error || cooperativaError}</p>;

  if (!producto) {
    return <div>No se ha encontrado la información del producto.</div>;
  }

    return (
        <div>
            <div className="cuadro">
                <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2><br/>
                <h4>Nombre *</h4>
                <input className="cajas" name="nombre" value={producto.nombre} onChange={handleDataChange} placeholder="Nombre" /><br/>
                <h4>Precio *</h4>
                <input className="cajas" type="text" name="precio" value={producto.precio} onChange={handleDataChange} placeholder="Precio" /><br/>
                <h4>Descripción</h4>
                <input className="cajas" name="descripcion" value={producto.descripcion} onChange={handleDataChange} placeholder="Descripción" /><br/>
                <h4>Material *</h4>
                <input className="cajas" name="material" value={producto.material} onChange={handleDataChange} placeholder="Material" /><br/>
                <h4>Stock *</h4>
                <input className="cajas" type="number" name="stock" value={producto.stock} onChange={handleDataChange} placeholder="Stock" /><br/>
                <h4>Categoría *</h4>
                <input className="cajas" name="categoria" value={producto.categoria || ""} onChange={handleDataChange} placeholder="Categoría" /><br/>
                <input type="file" name="imagen" onChange={handleImageChange} />
                <div>
                    <h4>Estado *</h4>
                    <select className="seleccion" name="estado" value={producto.estado} onChange={handleDataChange}>
                        <option value="publicado">Publicado</option>
                        <option value="no_publicado">No Publicado</option>
                    </select>
                </div>
                <button className="botones" onClick={isEditing ? handleDataSubmit : handleNewProductSubmit}>
                    {isEditing ? "✎ Guardar Cambios" : "✎ Agregar"}
                </button>
            </div><br/>

<div id="productos-lista">
  <h2>Productos de la Cooperativa</h2>
  {productos.length > 0 ? (
    productos.map((prod) => (
      <div key={prod.id} className="producto-item">
        <h3>{prod.nombre}</h3>
        <p><strong>Precio:</strong> {prod.precio}</p>
        <p><strong>Material:</strong> {prod.material}</p>
        <p><strong>Stock:</strong> {prod.stock}</p>
        <p><strong>Descripción:</strong> {prod.descripcion}</p>
        <div className="producto-imagenes">
          {prod.fotos && prod.fotos.map((foto) => (
            <img
              key={foto.id}
              src={foto.ubicacion || "URL_DE_IMAGEN_POR_DEFECTO"}
              alt={`Imagen de ${prod.nombre}`}
            />
          ))}
        </div>
      </div>
    ))
  ) : (
    <p>No hay productos disponibles.</p>
  )}
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
    {productos.map((producto) => (
      <tr key={producto.id}>
        <td>{producto.nombre}</td>
        <td>{producto.precio}</td>
        <td>{producto.descripcion}</td>
        <td>{producto.material}</td>
        <td>{producto.stock}</td>
        <td>{producto.estado}</td>
        <td>{producto.categoria}</td>
        <td>
          {producto.fotos && producto.fotos.length > 0 ? (
            producto.fotos.map((foto, index) => (
              <img
                key={index}
                src={foto.ubicacion}
                alt={`Imagen de ${producto.nombre}`}
                style={{ width: "100px", marginRight: "5px" }}
              />
            ))
          ) : (
            "Sin imagen"
          )}
        </td>
        <td>
          <button className="botones" onClick={() => setIsEditing(true)}>✎ Editar</button>
          <button className="botones" onClick={() => borrarProducto(producto.id)}>🗑 Borrar</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

<div className="contenedor-boton-cambiar-imagen">
  <button onClick={() => setIsImageEditing(true)}>
    ✎ Cambiar Imágenes
  </button>
</div>
      <h1 >Producto {producto.nombre}</h1>

      {isImageEditing && (
        <form onSubmit={handleImageSubmit}>
          <div className="contenedor-cambiar-imagen">
            <div id="titulo-actualizar-fotos">
              <h3>Actualizar Imágenes del Producto</h3>
              <p>Seleccione hasta 4 imágenes</p>
            </div>
            
            <div className="contenedor-subir-imagen">
              <input type="file" multiple onChange={handleImageChange} />
            </div>

            <div className="botones-acciones-formulario">
              <button type="submit">🖫 Guardar Imágenes</button>
              <button type="button" onClick={() => setIsImageEditing(false)}>
                ✖ Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {!isEditing ? (
        <div className="perfil-producto-datos-container">
          <div className="informacion-producto">
            <p>
              <strong>Nombre:</strong> {producto.nombre}
            </p>
            <p>
              <strong>Precio:</strong> {producto.precio}
            </p>
            <p>
              <strong>Material:</strong> {producto.material}
            </p>
            <p>
              <strong>Stock:</strong> {producto.stock}
            </p>
            <p>
              <strong>Descripción:</strong> "{producto.descripcion}"
            </p>
          </div>
          <div className="botones-acciones-formulario">
            <button onClick={() => setIsEditing(true)}>✎ Editar Datos</button>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleDataSubmit}>
            <div className="editar-datos-container-perfil-producto">
              <div id="titulo-actualizar-datos">
                <h3>Editar Información del Producto</h3>
              </div>
              <label>
                Nombre<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={producto.nombre || ""}
                onChange={handleDataChange}
              />
              <label>
                Precio<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="number"
                name="precio"
                value={producto.precio || ""}
                onChange={handleDataChange}
              />
              <label>
                Material<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="text"
                name="material"
                value={producto.material || ""}
                onChange={handleDataChange}
              />
              <label>
                Stock<span title="Este campo es obligatorio"> *</span>
              </label>
              <input
                type="number"
                name="stock"
                value={producto.stock || ""}
                onChange={handleDataChange}
              />
              <label>
                Descripción<span title="Este campo es obligatorio"> *</span>
              </label>
              <textarea
                name="descripcion"
                value={producto.descripcion || ""}
                onChange={handleDataChange}
              />

              <div className="botones-acciones-formulario">
                <button type="submit">✔ Confirmar Cambios</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    window.location.reload();
                  }}
                >
                  🗙 Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PerfilProducto;
