import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo873287.svg'; // Ajusta la ruta según sea necesario
import logoSoporte from '../assets/soporte873287.svg'; // Ajusta la ruta según sea necesario
import logoIdioma from '../assets/idioma873287.svg'; // Ajusta la ruta según sea necesario
import logoBolsa from '../assets/bolsa873287.svg'; // Ajusta la ruta según sea necesario
import logoFavoritos from '../assets/favoritos873287.svg'; // Ajusta la ruta según sea necesario
import '../styles/header-footer-styles.css';

const ComponenteHeader = () => {
    let navigate = useNavigate(); // Hook para la navegación
    
    const handleLoginClick = () => {
        navigate('/login'); // Redirige a la ruta /login
    };

    const userName = localStorage.getItem('userName');


  return (
    <div class="grid-layout-header">
        <div class="grid-layout-cabecera">
            <div class="logo"><a href="home.js"><img src={logo} alt="Logo"/></a></div>
            <div><input type="text" id="cajaBuscador" name="buscador" placeholder="Buscar artitulo"/></div>
            <div class="titulo2"><a href="home.js">Tunani</a></div>
            <div class="logo-soporte"><a href="soporte.js"><img src={logoSoporte} alt="Logo"/></a></div>
            <div class="logo-idioma"><a href=""><img src={logoIdioma} alt="Logo"/></a></div>
            <div class="logo-bolsa">
                <a href="">
                    <img src={logoBolsa} alt="Logo"/>
                </a>
            </div>
            <div class="logo-bolsa"><a href=""><img src={logoFavoritos} alt="Logo"/></a></div>                
            <div >
            {userName ? (
                        // Mostrar el nombre del usuario si está logueado
                        <span><b>{userName}</b></span>
                    ) :(
                <button className="inicio-sesion" onClick={handleLoginClick}><b>INICIAR SESIÓN</b></button>)}
            </div>
                    </div>
        <div class="grid-layout-categorias">
            <div>
                <select class="combo-box-categorias" name="Categorias">
                    <option value="">Categorias</option>
                    <option value="opcion1">opcion1</option>
                    <option value="opcion2">opcion2</option>
                    <option value="opcion2">opcion3</option>
                </select>
            </div>
            <div class="cat1"><a href="">Accesorios</a></div>
            <div class="cat1"><a href="">Ropa</a></div>
            <div class="cat1"><a href="">Calzado</a></div>
            <div class="cat1"><a href="">Bolsos</a></div>
            <div class="cat1"><a href="">Muebles</a></div>
            <div class="cat1"><a href="">Hogar</a></div>
            <div class="cat1"><a href="">Decoración</a></div>
        </div>
    </div>
  )
}

export default ComponenteHeader