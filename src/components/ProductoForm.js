import React, { useState } from 'react';
import axios from 'axios'; // Para interactuar con la API

const ProductoForm = ({ productoActual, artesanos, onSubmit, onCancel, isEditing }) => {
    // Estados para cada campo del formulario
    const [nombre, setNombre] = useState(productoActual.nombre || '');
    const [precio, setPrecio] = useState(productoActual.precio || '');
    const [descripcion, setDescripcion] = useState(productoActual.descripcion || '');
    const [material, setMaterial] = useState(productoActual.material || '');
    const [cantidad, setCantidad] = useState(productoActual.stock || 0);
    const [estado, setEstado] = useState(productoActual.estado || 'no_publicado');
    const [artesanoId, setArtesanoId] = useState(productoActual.artesano || '');
    const [imagenes, setImagenes] = useState(productoActual.imagenes || Array(5).fill(null));
    const [isPublished, setIsPublished] = useState(productoActual.isPublished || false);

    // Maneja el cambio en los campos del formulario
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // Maneja el cambio en el input de imágenes
    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        const newImages = [...imagenes];
        newImages[index] = URL.createObjectURL(file);
        setImagenes(newImages);
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construye el objeto producto
        const producto = {
            nombre,
            precio,
            descripcion,
            material,
            stock: cantidad,
            estado,
            artesano: artesanoId,
            // asumiendo que se manejará la lógica para las imágenes y la publicación del lado del servidor
        };

        // Llamar a onSubmit, pasando el producto y las imágenes
        onSubmit(producto, imagenes, isPublished);
    };

    return (
        <div className="craft-form">
            <form onSubmit={handleSubmit}>
                {/* Inputs y selects para los detalles del producto */}
                <input value={nombre} onChange={handleChange(setNombre)} placeholder="Nombre del producto" />
                <input type="number" value={precio} onChange={handleChange(setPrecio)} placeholder="Precio" />
                <textarea value={descripcion} onChange={handleChange(setDescripcion)} placeholder="Descripción" />
                <select value={material} onChange={handleChange(setMaterial)}>
                    <option value="">Seleccionar material</option>
                    {/* Opciones de materiales */}
                </select>
                <input type="number" value={cantidad} onChange={handleChange(setCantidad)} placeholder="Cantidad" />
                <select value={estado} onChange={handleChange(setEstado)}>
                    <option value="publicado">Publicado</option>
                    <option value="no_publicado">No Publicado</option>
                </select>
                <select value={artesanoId} onChange={handleChange(setArtesanoId)}>
                    <option value="">Seleccionar artesano</option>
                    {artesanos.map((artesano) => (
                        <option key={artesano.id} value={artesano.id}>{artesano.nombre}</option>
                    ))}
                </select>
                {/* Inputs para imágenes */}
                {imagenes.map((imagen, index) => (
                    <input key={index} type="file" onChange={(e) => handleImageChange(e, index)} />
                ))}
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                <label>Publicar</label>
                <button type="submit">{isEditing ? 'Editar' : 'Agregar'}</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </form>
        </div>
    );
};

export default ProductoForm;
