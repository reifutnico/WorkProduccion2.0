import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import '../css/Navbar.css';





const Navbar = () => {
const location = useLocation();
//let { searchTerm, servicios } = location.state;

  const [dropdown, setDropdown] = useState(null);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [subCategorias, setSubCategorias] = useState({});

  useEffect(() => {
    // Obtener las categorías madre al cargar el componente
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
    setDropdown(categoriaMadre.id); // Abre el dropdown para la categoría madre actual
    // Obtener las subcategorías para la categoría madre actual
      try {
        console.log(categoriaMadre.id);
        const response = await axios.get(`http://localhost:5432/Categoria/SubCategorias/${categoriaMadre.id}`);
        setSubCategorias(prevSubCategorias => ({
          ...prevSubCategorias,
          [categoriaMadre.id]: response.data
        }));
      } catch (error) {
        console.error('Error al buscar SubCategorias:', error);
      }
  };

  const handleMouseLeave = () => {
    setDropdown(null); // Cierra el dropdown cuando el mouse se aleje
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
                  <Link key={subCategoria.id} to={`/${categoria.nombre}/${subCategoria.nombre}`}>
                    {subCategoria.Nombre}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="navbar-buttons">
        <button className="navbar-button sign-up">Sign-Up</button>
        <button className="navbar-button log-in">Log-in</button>
      </div>
    </nav>
  );
};

export default Navbar;
