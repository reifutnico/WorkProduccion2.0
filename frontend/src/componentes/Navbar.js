import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';

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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">worky.</Link>
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
        <button className="login-btn">Login</button>
        <button className="signup-btn">Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;
