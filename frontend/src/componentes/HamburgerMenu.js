import React, { useEffect, useRef } from 'react';

const HamburgerMenu = ({ isMenuOpen, toggleMenu, handleMenuOptionClick }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    // Detecta los clics fuera del menú
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(false); // Cierra el menú si el clic es fuera del menú
      }
    };

    // Añadir el evento al document
    document.addEventListener('mousedown', handleClickOutside);

    // Eliminar el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleMenu]);

  return (
    <>
      {/* Menú hamburguesa */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <span className="close-menu" onClick={() => toggleMenu(false)}>X</span>
        <div className="menu-content">
          <div className="menu-item" onClick={() => handleMenuOptionClick('perfil')}>
            <span>Mi Perfil</span>
            <i className="menu-icon profile-icon"></i>
          </div>
          <div className="menu-item" onClick={() => handleMenuOptionClick('servicios')}>
            <span>Servicios Contratados</span>
            <i className="menu-icon services-icon"></i>
          </div>
          <div className="menu-item" onClick={() => handleMenuOptionClick('mis-servicios')}>
            <span>Mis Servicios</span>
            <i className="menu-icon mis-servicios-icon"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
