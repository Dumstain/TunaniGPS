import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/LoginForm.css"

const LoginForm = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [error, setError] = useState('');
    const [loginMessage, setLoginMessage] = useState(''); // Agregado para mostrar el mensaje de login
    const navigate = useNavigate(); // Hook para navegar


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoginMessage(''); // Limpiar mensaje previo

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasenia })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userId', data.id)
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('userRole', data.rol);
                localStorage.setItem('userName', data.usuario);
                switch (data.rol) {
                    case 'Admin':
                        navigate('/admin');
                        break;
                    case 'Representante':
                        navigate('/representante');
                        break;
                    case 'Comprador':
                        navigate('/');
                        break; // Redirige a la página de inicio para cualquier otro rol
                }
            } else {
                setError(data.message || 'Error desconocido');
            }
        } catch (error) {
            setError('Error al conectarse al servidor');
        }
    };



    return (
        <div className="login-container">
            <div className="form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="form-title">Bienvenido</h2> {/* Add class for styling the title */}
                    {error && <p className="error">{error}</p>}
                    <div className="form-field">
                        <label className="input-label">Email</label> {/* Add class for styling the label */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field" // Add class for styling the input field
                        />
                    </div>
                    <div className="form-field">
                        <label className="input-label">Contraseña</label> {/* Add class for styling the label */}
                        <input
                            type="password"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            className="input-field" // Add class for styling the input field
                        />
                    </div>
                    <div className="form-field">
                    <input 
                        type="checkbox"
                        id="remember-me"
                        className="checkbox" // Make sure to use the same class name used in your CSS
                    />
                      <label htmlFor="remember-me" className="checkbox-label">Recordarme</label>
                      </div>

                    <button type="submit" className="submit-button">Iniciar Sesión</button> {/* Add class for styling the button */}
                    <div className="signup-link">¿No tienes cuenta? <span onClick={toggleForm} className="signup-link-anchor">Registrarse</span></div>
                </form>
                {loginMessage && <p className="login-message">{loginMessage}</p>} {/* Add class for styling the login message */}
            </div>
            <div className="image-container">
                {/* Image is set as a background in CSS */}
            </div>
        </div>
    );
};

export default LoginForm;