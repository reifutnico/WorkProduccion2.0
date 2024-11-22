import React, { useEffect, useRef } from 'react';

const HamburgerMenu = ({ isMenuOpen, toggleMenu, handleMenuOptionClick }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic fue fuera del menú
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        // Verificamos que el clic no sea en el botón de hamburguesa
        const hamburgerButton = document.querySelector('.hamburger-icon');
        if (!hamburgerButton.contains(event.target)) {
          toggleMenu(false);
        }
      }
    };

    // Agregamos el event listener cuando el componente se monta
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiamos el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div ref={menuRef} className="menu-content">
          <span className="close-menu" onClick={() => toggleMenu(false)}>X</span>
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