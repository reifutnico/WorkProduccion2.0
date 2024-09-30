import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png'; 
import Modal from './modal'; 
import Login from './login'; // Importa el componente Login

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [subCategorias, setSubCategorias] = useState({});

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

  const handleMouseEnter = async (categoriaMadre) => {
    setDropdown(categoriaMadre.id);
    if (!subCategorias[categoriaMadre.id]) {
      try {
        const response = await axios.get(`http://localhost:5432/Categoria/SubCategorias/${categoriaMadre.id}`);
        setSubCategorias(prevSubCategorias => ({
          ...prevSubCategorias,
          [categoriaMadre.id]: response.data
        }));
      } catch (error) {
        console.error('Error al buscar SubCategorias:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Worky Logo" className="navbar-logo-img" /> {/* Usa el logo importado */}
        </Link>
      </div>
      <ul className="navbar-menu">
        {categoriasMadre.map((categoria) => (
          <li
            key={categoria.id}
            className="navbar-item"
            onMouseEnter={() => handleMouseEnter(categoria)}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={`/${categoria.nombre}`}>{categoria.nombre}</Link>
            {dropdown === categoria.id && (
              <div className="dropdown">
                {subCategorias[categoria.id] && subCategorias[categoria.id].map((subCategoria) => (
                  <Link key={subCategoria.id} to={`/${subCategoria.nombre}`}>{subCategoria.nombre}</Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="navbar-buttons">
                    {/* Botón de Login abre el modal */}
                    <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
                    
                    {/* Botón de Register redirige a la página de registro */}
                    <Link to="/register">
                        <button className="signup-btn">Register</button>
                    </Link>
                </div>
            <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
                <Login />
            </Modal>
    </nav>
  );
}

export default Navbar;
