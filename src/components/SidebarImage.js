import React from 'react';
import backgroundImage from '../assets/fondologin.webp'; // Asegúrate de tener una imagen adecuada

function SidebarImage() {
  return (
    <div className="sidebar-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
    </div>
  );
}

export default SidebarImage;
