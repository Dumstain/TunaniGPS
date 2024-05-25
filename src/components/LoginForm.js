import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/LoginForm.css";

const LoginForm = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // Estado para mostrar/ocultar contraseña
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');  // Limpiar errores anteriores
        
        // Limpiar localStorage antes de cualquier operación de login
        localStorage.removeItem('user');

        // Validar el formato de email antes de proceder con el login
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setError('Por favor ingresa un correo electrónico válido.');
            return;
        }

        try {
            const data = await login(email, contrasenia);
            console.log('Login successful:', data); // Loguear éxito para diagnóstico
            // Navegar según el rol del usuario
            switch (data.rol) {
                case 'Admin':
                    navigate('/admin');
                    break;
                case 'Representante':
                    console.log("Usuario en local storage:", localStorage.getItem('user'));
                    navigate('/representante');
                    break;
                case 'Comprador':
                    navigate('/');
                    break;
                default:
                    navigate('/'); // Redirigir a la página de inicio por defecto
                    break;
            }
        } catch (error) {
            console.error('Login failed:', error); // Loguear error para diagnóstico
            setError(error.message || 'Error desconocido al iniciar sesión');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="form-title">Bienvenido</h2>
                    {error && <p className="error">{error}</p>}
                    <div className="form-field">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="input-label">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            className="input-field"
                            required
                        />
                   
                    </div>
                    <button type="submit" className="submit-button">Iniciar Sesión</button>
                    <div className="signup-link">¿No tienes cuenta? <span onClick={toggleForm} className="signup-link-anchor">Registrarse</span></div>
                </form>
            </div>
            <div className="image-container">
                {/* Image is set as a background in CSS */}
            </div>
        </div>
    );
};

export default LoginForm;
