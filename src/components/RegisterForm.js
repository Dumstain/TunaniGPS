import React, { useState } from 'react';
import '../styles/RegisterForm.css';


const RegisterForm = ({toggleForm}) => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [nombreUser, setNombreUser] = useState('');
    const [nombre, setNombre] = useState('');
    const [materno, setMaterno] = useState('');
    const [paterno, setPaterno] = useState('');
    const [tel, setTel] = useState('');
    const [ine, setIne] = useState('');
    const [metodoPago, setMetodoPago] = useState('Por definir');
    const [notificaciones, setNotificaciones] = useState(false); // Estado inicial como false
    const [error, setError] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setRegisterMessage('');
    
        // Aquí generamos el nombre de usuario automáticamente como solicitaste
        // Asumimos que 'nombre' y 'paterno' ya contienen los valores ingresados por el usuario
        // Tomamos el primer nombre (en caso de que 'nombre' contenga más de uno) y el apellido paterno
        const nombreUser = `${nombre.split(' ')[0]} ${paterno}`;
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/registro/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email, // Asume que email ya está definido y almacenado en el estado
                    contrasenia, // Asume que contrasenia ya está definida y almacenada en el estado
                    nombre_user: nombreUser, // Usamos el nombre de usuario generado
                    rol: 3, // Este valor deberá manejarse en el backend para el rol "comprador"
                    datos: {
                        nombre, // Asume que nombre ya está definido y almacenado en el estado
                        materno, // Asume que materno ya está definido y almacenado en el estado
                        paterno, // Asume que paterno ya está definido y almacenado en el estado
                        tel, // Asume que tel ya está definido y almacenado en el estado
                        ine, // Asume que ine ya está definido y almacenado en el estado
                        metodo_pago: metodoPago, // Asume que metodoPago ya está definido y almacenado en el estado
                        notificaciones // Asume que notificaciones ya está definida y almacenada en el estado
                    }
                })
            });

            const data = await response.json();
            if (response.ok) {
                setRegisterMessage("Usuario registrado con éxito. Por favor, inicia sesión.");
                setEmail('');
                setContrasenia('');
                setNombreUser('');
                // Limpiar los demás campos
                setNombre('');
                setMaterno('');
                setPaterno('');
                setTel('');
                setIne('');
                setMetodoPago('');
                setNotificaciones('');
            } else {
                setError(data.message || 'Error desconocido durante el registro.');
            }
        } catch (error) {
            setError('Error al conectarse al servidor para el registro.');
        }

    };

    const handleChangeNombreCompleto = (e) => {
        const fullName = e.target.value;
        const parts = fullName.trim().split(/\s+/); // Divide por uno o más espacios
    
        if (parts.length >= 3) {
            // Actualiza el apellido materno y paterno con las últimas dos palabras
            const newMaterno = parts.pop(); // Última palabra
            const newPaterno = parts.pop(); // Penúltima palabra
            // El resto se considera el nombre
            const newNombre = parts.join(' ');
    
            // Actualiza el estado
            setNombre(newNombre);
            setMaterno(newMaterno);
            setPaterno(newPaterno);
        }
    };


    
    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Registrarse</h2>
                {error && <p className="error-message">{error}</p>}
                {registerMessage && <p className="register-message">{registerMessage}</p>}
                <div className="form-field">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                </div>
                <div className="form-field">
                    <label>Contraseña:</label>
                    <input type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} className="input-field" />
                </div>

<div className="form-field">
    <label>Nombre Completo:</label>
    <input
        type="text"
        className="input-field"
        placeholder="Nombre Apellido Paterno Apellido Materno"
        onChange={handleChangeNombreCompleto}
    />
</div>
                <div className="form-field">
                    <label>Teléfono:</label>
                    <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} className="input-field" />
                </div>
                <div className="form-field">
    <label>
        <input
            type="checkbox"
            checked={notificaciones}
            onChange={(e) => setNotificaciones(e.target.checked ? 1 : 0)} // Aquí conviertes el estado a 1 o 0
            className="input-checkbox"
        />
        ¿Recibir notificaciones a su correo?
    </label>
</div>
                <button type="submit" className="submit-button">Registrarse</button>
                <div className="signup-link">¿Ya tienes cuenta? <span onClick={toggleForm} className="signup-link-anchor">Iniciar Sesión</span></div>

            </form>
            <div className="image-container">
                {/* Image is set as a background in CSS */}
            </div>
        </div>
        
    );
    
};

export default RegisterForm;