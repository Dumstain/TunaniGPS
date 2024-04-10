import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'; // Asegúrate de que la ruta es correcta
import RegisterForm from '../components/RegisterForm'; // Asegúrate de que la ruta es correcta

const LoginPage = () => {
    const [showLoginForm, setShowLoginForm] = useState(true); // Controla qué formulario se muestra

    const toggleForm = () => setShowLoginForm(!showLoginForm); // Cambia el formulario que se muestra

    return (
        <div>
            {showLoginForm ? 
                <LoginForm toggleForm={toggleForm} /> : 
                <RegisterForm toggleForm={toggleForm} />
            }
        </div>
    );
};

export default LoginPage;
