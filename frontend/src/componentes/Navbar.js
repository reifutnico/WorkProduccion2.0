import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para manejar la navegación
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import Login from './login'; // Importa el componente Login

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  
  const navigate = useNavigate(); // Hook para navegación

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

  const handleSearch = async (categoriaNombre) => {
    try {
      const params = { 'CategoriaNombre': categoriaNombre };
      const response = await axios.get(`http://localhost:5432/Servicio/`, { params });
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
            onClick={() => handleSearch(categoria.nombre)} // Llama a handleSearch al hacer clic
          >
            {categoria.nombre}
          </li>
        ))}
      </ul>
      <div className="navbar-buttons">
        <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
        <a href="/register">
          <button className="signup-btn">Register</button>
        </a>
      </div>
      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
        <Login />
      </Modal>
    </nav>
  );
}

export default Navbar;
