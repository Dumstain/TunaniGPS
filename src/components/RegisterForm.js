import React, { useState } from 'react';
import '../styles/RegisterForm.css';

const RegisterForm = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [nombre, setNombre] = useState('');
    const [materno, setMaterno] = useState('');
    const [paterno, setPaterno] = useState('');
    const [tel, setTel] = useState('');
    const [ine, setIne] = useState('');
    const [metodoPago, setMetodoPago] = useState('Por definir');
    const [notificaciones, setNotificaciones] = useState(false);
    const [error, setError] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const validateInputs = () => {
        if (!email || !contrasenia || !nombre || !paterno || !tel || !ine) {
            setError('Todos los campos obligatorios deben ser llenados.');
            return false;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setError('El email no es válido.');
            return false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(contrasenia)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');
            return false;
        }

        const telRegex = /^[0-9]{10}$/;
        if (!telRegex.test(tel)) {
            setError('El teléfono debe tener 10 dígitos.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setRegisterMessage('');

        if (!validateInputs()) return;

        // Generar el nombre de usuario automáticamente
        const nombreUser = `${nombre.split(' ')[0]} ${paterno}`;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/registro/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    contrasenia,
                    nombre_user: nombreUser,
                    rol: 3, // Rol para comprador
                    datos: {
                        nombre,
                        materno,
                        paterno,
                        tel,
                        ine,
                        metodo_pago: metodoPago,
                        notificaciones,
                    }
                })
            });

            const data = await response.json();
            if (response.ok) {
                setRegisterMessage("Usuario registrado con éxito. Por favor, inicia sesión.");
                // Limpiar los campos del formulario
                setEmail('');
                setContrasenia('');
                setNombre('');
                setMaterno('');
                setPaterno('');
                setTel('');
                setIne('');
                setMetodoPago('Por definir');
                setNotificaciones(false);
            } else {
                setError(data.message || 'Error desconocido durante el registro.');
            }
        } catch (error) {
            setError('Error al conectarse al servidor para el registro.');
        }
    };

    const handleChangeNombreCompleto = (e) => {
        const fullName = e.target.value;
        const parts = fullName.trim().split(/\s+/);

        if (parts.length >= 3) {
            const newMaterno = parts.pop();
            const newPaterno = parts.pop();
            const newNombre = parts.join(' ');

            setNombre(newNombre);
            setMaterno(newMaterno);
            setPaterno(newPaterno);
        } else {
            setError('Por favor, ingrese el nombre completo en el formato: Nombre (segundo nombre opcional) Apellido Paterno Apellido Materno.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Registrarse</h2>
                {error && <div className="notification error-message">{error}</div>}
                {registerMessage && <div className="notification register-message">{registerMessage}</div>}
                <div className="form-field">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="ejemplo@correo.com"
                    />
                </div>
                <div className="form-field">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        className="input-field"
                        placeholder="Mínimo 8 caracteres, letras y números"
                    />
                        <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                        /> Mostrar Contraseña
                    </label>
                </div>
                <div className="form-field">
                    <label>Nombre Completo:</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Nombre (segundo nombre opcional) Apellido Paterno Apellido Materno"
                        onChange={handleChangeNombreCompleto}
                    />
                </div>
                <div className="form-field">
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        className="input-field"
                        placeholder="10 dígitos"
                    />
                </div>
                <div className="form-field">
                    <label>INE:</label>
                    <input
                        type="text"
                        value={ine}
                        onChange={(e) => setIne(e.target.value)}
                        className="input-field"
                        placeholder="Clave de Elector"
                    />
                </div>
                <div className="form-field">
                    <label>Método de Pago:</label>
                    <input
                        type="text"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="input-field"
                        placeholder="Por definir"
                    />
                </div>
                <div className="form-field">
                    <label>
                        <input
                            type="checkbox"
                            checked={notificaciones}
                            onChange={(e) => setNotificaciones(e.target.checked)}
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
