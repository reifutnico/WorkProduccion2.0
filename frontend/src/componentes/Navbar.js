import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import Login from './login';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const { token, user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriasMadre = async () => {
      try {
        const response = await axios.get('http://localhost:5432/Categoria/categoriasMadre');
        setCategoriasMadre(response.data);
      } catch (error) {
        console.error('Error al buscar CategoriasMadre:', error);
      }
    };
    fetchCategoriasMadre();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="Worky Logo" className="navbar-logo-img" />
        </a>
      </div>
      <ul className="navbar-menu">
        {categoriasMadre.map((categoria) => (
          <li
            key={categoria.id}
            className="navbar-item"
          >
            {categoria.nombre}
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <div className="navbar-buttons">
            <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
            <a href="/register">
              <button className="signup-btn">Register</button>
            </a>
          </div>
        )}
        <div className="hamburger-icon" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <span className="close-menu" onClick={toggleMenu}>&times;</span>
        <div className="menu-content">
          <a href="#">Mi perfil</a>
          <a href="#">Mis servicios</a>
          <a href="#">Mis pagos</a>
          <a href="#">Próximas citas</a>
          <a href="#" onClick={handleLogout}>Cerrar sesión</a>
        </div>
      </div>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
        <Login />
      </Modal>
    </nav>
  );
};

export default Navbar;
