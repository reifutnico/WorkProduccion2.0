import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import ModalNotificaciones from './modalNotificaciones';
import { format } from 'date-fns';
import Login from './login';
import Register from './register'; // Importa el componente Register
import { UserContext } from '../context/UserContext';
import { FaBell } from 'react-icons/fa';
import HamburgerMenu from './HamburgerMenu'; // Importa el componente del menú hamburguesa

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false); // Nuevo estado para el modal de registro
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [hasData, setHasData] = useState(false);

  const { token, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriasMadre = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Categoria/categoriasMadre');
        setCategoriasMadre(response.data);
      } catch (error) {
        console.error('Error al buscar CategoriasMadre:', error);
      }
    };
    fetchCategoriasMadre();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
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
            onClick={() => navigate(`/search/${categoria.nombre}`)}
          >
            {categoria.nombre}
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        {token ? (
          <>
            <div className="notification-bell" onClick={() => setNotificationsOpen(true)}>
              <FaBell size={24} />
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="navbar-buttons">
            <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
            <button className="signup-btn" onClick={() => setRegisterOpen(true)}>Register</button>
          </div>
        )}
        <div className="hamburger-icon" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Login">
        <Login />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} title="Registro">
        <Register onClose={() => setRegisterOpen(false)} />
      </Modal>
    </nav>
  );
};

export default Navbar;
