// CraftForm.js
import React, { useState } from 'react';
import '../styles/CraftForm.css';





  
const CraftForm = ({ show }) => {

    const [inputValue, setInputValue] = useState('');                   //paso 1
    const [selectedOption, setSelectedOption] = useState('');           // paso 2
    const [priceValue, setPriceValue] = useState('');                   // paso 3
    const [focusValue, setFocusValue] = useState('');                   //paso 4
    const [materialValue, setMaterialValue] = useState('');             // paso 5
    const [descriptionValue, setDescriptionValue] = useState('');       //paso 6
    const [quantity, setQuantity] = useState(0);                        //paso 7
    const [images, setImages] = useState(Array(5).fill(null));          //paso 8
    const [isPublished, setIsPublished] = useState(false);              //paso 9
    const [formData, setFormData] = useState({
        // Definir otros campos del formulario según sea necesario
      });


      const [formClass, setFormClass] = useState('craft-form');


    const handleInputChange = (event) => {
        setInputValue(event.target.value.slice(0, 20)); // Limita la longitud a 20 caracteres
      };

      //const formClass = show ? 'craft-form active' : 'craft-form';

      const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
      };

      const handlePriceChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
        setPriceValue(value.slice(0, 6)); // Limita la longitud a 6 caracteres
      };

      const handleFocusChange = (event) => {
        setFocusValue(event.target.value);
      };

      const handleMaterialChange = (event) => {
        setMaterialValue(event.target.value);
      };

      const handleDescriptionChange = (event) => {
        setDescriptionValue(event.target.value.slice(0, 255)); // Limita la longitud a 255 caracteres
      };

      const handleDecrement = () => {
        setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0)); // Disminuir la cantidad en 1, mínimo 0
      };
    
      const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1); // Aumentar la cantidad en 1
      };
    
      const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value) || 0; // Parsear el valor como entero o 0 si no es un número
        setQuantity(value);
      }

      const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        const newImages = [...images];
        newImages[index] = URL.createObjectURL(file);
        setImages(newImages);
      };

      const handleCheckboxChange = () => {
        setIsPublished(!isPublished);
      };

      const handleFormChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

     

      const handleSaveData = () => {
        // Aquí puedes agregar la lógica para guardar los datos en la tabla
        console.log('Datos guardados:', formData);
      };

      const handleCloseForm = () => {
       
        setFormClass('craft-form hidden');
      };

      const handleShowForm = () => {
        setFormClass('craft-form');
    };


    return (
        <div className={formClass ? 'craft-form active' : 'craft-form'}>
        <div className="craft-form-header">
        <h2>Agregar artesanías</h2>
      </div>
        {/* Aquí va tu formulario */}
        <form>
        {/* Paso 1: Agregue el nombre del producto */}
        <div style={{ marginTop: '20px' }}>
          <label className="step-text">Paso 1: Agregue el nombre del producto</label>
          <input
            type="text"
            className="text-input"
            value={inputValue}
            placeholder="(Max 20 palabras)"
            onInput={handleInputChange}
          />
          </div>
        <div style={{ marginTop: '20px' }}>
          {/* Paso 2: Seleccione al creador de la artesanía */}
          <label className="step-text">Paso 2: Seleccione al creador de la artesanía</label>
          {/* Combo box */}
          <select
            className="combo-box"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Seleccionar</option>
            <option value="option1">Roberto</option>
            <option value="option2">Maria</option>
            <option value="option3">Julian</option>
            <option value="option4">Teresa</option>
          </select>
        </div>
        <div>
        <label className="agregar-creador"><a href="#">Agregar nuevo integrante o creador</a></label>
        </div>
        <div style={{ marginTop: '20px' }}>
          {/* Paso 3: Agregue precio del producto (sin iva) */}
          <label className="step-text">Paso 3: Agregue precio del producto (sin IVA)</label>
          <input
            type="text"
            className="price-input"
            value={priceValue}
            placeholder="Precio"
            onInput={handlePriceChange}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          {/* Paso 4: Especifique el enfoque */}
          <label className="step-text">Paso 4: Especifique el enfoque</label>
          <select
            className="combo-box"
            value={focusValue}
            onChange={handleFocusChange}
          >
            <option value="">Seleccionar</option>
            <option value="option1">Hogar</option>
            <option value="option2">Oficina</option>
            <option value="option3">Exterior</option>
            
          </select>
          </div>
          <div style={{ marginTop: '20px' }}>
          {/* Paso 5: Especifique el material principal */}
          <label className="step-text">Paso 5: Especifique el material principal</label>
          <select
            className="combo-box"
            value={materialValue}
            onChange={handleMaterialChange}
          >
            <option value="">Seleccionar</option>
            <option value="material1">Tela</option>
            <option value="material2">Ceramica</option>
            <option value="material3">Cobre</option>
            <option value="material4">Barro</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          {/* Paso 6: Agregue descripción del producto */}
          <label className="step-text">Paso 6: Agregue descripción del producto</label>
          <textarea
            className="description-input"
            value={descriptionValue}
            placeholder="(Max 255 palabras)"
            onInput={handleDescriptionChange}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          {/* Paso 7: Agregue la cantidad disponible del producto */}
          <label className="step-text">Paso 7: Agregue la cantidad disponible del producto</label>
          <div className="quantity-controls">
            <button className="quantity-button-" onClick={handleDecrement}>-</button>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button className="quantity-button-mas" onClick={handleIncrement}>+</button>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          {/* Paso 8: Agregue cinco fotos sobre el producto */}
          <label className="step-text">Paso 8: Agregue cinco fotos sobre el producto</label>
          <div className="image-uploads">
            {images.map((image, index) => (
              <div key={index} className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                />
                {image ? (
                  <img src={image} alt={`Imagen ${index + 1}`} />
                ) : (
                  <span className="upload-icon"></span>
                )}
              </div>
            ))}
          </div>
        </div>
        
          {/* Paso 9: Seleccione la casilla si quiere que el producto sea publicado */}
          <label className="step-text">Paso 9: Seleccione la casilla si quiere que el producto sea publicado</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="published-checkbox"
              checked={isPublished}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="published-checkbox">¿Publicar producto?</label>
          </div>
          {/* Botones "Cancelar" y "Guardar" */}
        <div className="form-buttonsc">
          <button type="button" onClick={handleCloseForm}>Cancelar</button>
        </div>
        <div className="form-buttonsg">
          <button type="button" onClick={handleSaveData}>Guardar</button>
        </div>
        
        
        
        
      </form>
      </div>
    );
}

export default CraftForm;
