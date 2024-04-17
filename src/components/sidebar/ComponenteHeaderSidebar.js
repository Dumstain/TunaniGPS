import React from 'react'
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import logo from '../../assets/logo873287.svg'; // Ajusta la ruta según sea necesario
import logoSoporte from '../../assets/soporte873287.svg'; // Ajusta la ruta según sea necesario
import logoIdioma from '../../assets/idioma873287.svg'; // Ajusta la ruta según sea necesario
import logoBolsa from '../../assets/bolsa873287.svg'; // Ajusta la ruta según sea necesario
import logoFavoritos from '../../assets/favoritos873287.svg'; // Ajusta la ruta según sea necesario
import '../../styles/header-representante-styles.css';


export const ComponenteHeaderSidebar = () => {
  const navigate = useNavigate(); // Inicializa el hook
  const handleUserViewClick = () => {
    navigate('/'); // Navega a la ruta de inicio
  };

  return (
    <div>
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
            <div className="inicio-sesion"><a onClick={handleUserViewClick} style={{cursor: 'pointer'}}><b>VISTA USUARIO</b></a></div>        </div>
    </div>
    
  )
}
