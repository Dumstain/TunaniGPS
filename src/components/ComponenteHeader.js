import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo873287.svg';
import logoSoporte from '../assets/soporte873287.svg';
import logoIdioma from '../assets/idioma873287.svg';
import logoBolsa from '../assets/bolsa873287.svg';
import logoFavoritos from '../assets/favoritos873287.svg';
import '../styles/header-footer-styles.css';

const ComponenteHeader = () => {
    let navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const userName = localStorage.getItem('userName');

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleUserHover = () => {
        setShowDropdown(true);
    };

    const handleUserLeave = () => {
        setShowDropdown(false);
    };

    const cerrarSesion = () => {
        // Eliminar los datos de sesión del localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        
        // Redirigir al usuario a la página de inicio o de inicio de sesión
        navigate('/');
      };

    return (
        <div className="grid-layout-header">
            <div className="grid-layout-cabecera">
                <div className="logo">
                    <a href="home.js">
                        <img src={logo} alt="Logo" />
                    </a>
                </div>
                <div>
                    <input
                        type="text"
                        id="cajaBuscador"
                        name="buscador"
                        placeholder="Buscar artículo"
                    />
                </div>
                <div className="titulo2">
                    <a href="home.js">Tunani</a>
                </div>
                <div className="logo-soporte">
                    <a href="soporte.js">
                        <img src={logoSoporte} alt="Logo" />
                    </a>
                </div>
                <div className="logo-idioma">
                    <a href="">
                        <img src={logoIdioma} alt="Logo" />
                    </a>
                </div>
                <div className="logo-bolsa">
                    <a href="">
                        <img src={logoBolsa} alt="Logo" />
                    </a>
                </div>
                <div className="logo-bolsa">
                    <a href="">
                        <img src={logoFavoritos} alt="Logo" />
                    </a>
                </div>
                <div>
                    {userName ? (
                        <div
                            className="user-dropdown"
                            onMouseEnter={handleUserHover}
                            onMouseLeave={handleUserLeave}
                        >
                            <span>
                                <b>{userName}</b>
                            </span>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <a href="/perfilUsuario">View Profile</a>
                                    <a href="/" onClick={cerrarSesion}>Log Out</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="inicio-sesion" onClick={handleLoginClick}>
                            <b>INICIAR SESIÓN</b>
                        </button>
                    )}
                </div>
            </div>
            <div className="grid-layout-categorias">
                <div>
                    <select className="combo-box-categorias" name="Categorias">
                        <option value="">Categorias</option>
                        <option value="opcion1">opcion1</option>
                        <option value="opcion2">opcion2</option>
                        <option value="opcion2">opcion3</option>
                    </select>
                </div>
                <div className="cat1">
                    <a href="">Accesorios</a>
                </div>
                <div className="cat1">
                    <a href="">Ropa</a>
                </div>
                <div className="cat1">
                    <a href="">Calzado</a>
                </div>
                <div className="cat1">
                    <a href="">Bolsos</a>
                </div>
                <div className="cat1">
                    <a href="">Muebles</a>
                </div>
                <div className="cat1">
                    <a href="">Hogar</a>
                </div>
                <div className="cat1">
                    <a href="">Decoración</a>
                </div>
            </div>
        </div>
    );
};

export default ComponenteHeader;