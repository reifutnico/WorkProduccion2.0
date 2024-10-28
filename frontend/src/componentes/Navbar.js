import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import Login from './login';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const { token, user, logout } = useContext(UserContext);
  const [isMenuOpen, setMenuOpen] = useState(false);
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

  const handleMouseEnter = (categoriaMadre) => {
    setDropdown(categoriaMadre.id);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = async (categoriaNombre) => {
    try {
      const params = { 'CategoriaNombre': categoriaNombre };
      const response = await axios.get('http://localhost:5432/Servicio/', { params });
      const servicios = response.data;
      navigate('/resultados', { state: { searchTerm: categoriaNombre, servicios } });
    } catch (error) {
      console.error('Error al buscar servicios:', error);
    }
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
            onMouseEnter={() => handleMouseEnter(categoria)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleSearch(categoria.nombre)}
          >
            {categoria.nombre}
          </li>
        ))}
      </ul>
      {!token ? (
        <div className="navbar-buttons">
          <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
          <a href="/register">
            <button className="signup-btn">Register</button>
          </a>
        </div>
      ) : (
        <div className="navbar-user">
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
      <div className="hamburger-icon" onClick={() => setMenuOpen(!isMenuOpen)}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="close-menu" onClick={() => setMenuOpen(false)}>&times;</div>
        <div className="menu-content">
          <a href="/mi-perfil">Mi perfil</a>
          <a href="/mis-servicios">Mis servicios</a>
          <a href="/mis-pagos">Mis pagos</a>
          <a href="/proximas-citas">Próximas citas</a>
          <a onClick={handleLogout}>Cerrar sesión</a>
        </div>
      </div>
      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
        <Login />
      </Modal>
    </nav>
  );
};

export default Navbar;
