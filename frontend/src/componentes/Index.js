import React, { useState, useEffect, useContext } from 'react';
import trabajadorImg from '../img/trabajadorIndex.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css';
import { UserContext } from '../context/UserContext';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modo, setModo] = useState("Nombre");
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Índice para controlar el desplazamiento
  const navigate = useNavigate();
  const itemsPerPage = 4; // Cantidad de categorías visibles
  const { token } = useContext(UserContext);

  // Obtener categorías madre para el carrusel
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

  // Función para manejar el cambio de categorías visibles al presionar las flechas
  const handleNext = () => {
    if (currentIndex < categoriasMadre.length - itemsPerPage) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const handleSearch = async () => {
    try {
      const params = { [modo]: searchTerm };
      const response = await axios.get(`http://localhost:5000/Servicio/`, { params });
      const servicios = response.data;
      navigate('/resultados', { state: { searchTerm, servicios } });
    } catch (error) {
      console.error("Error al buscar servicios:", error);
    }
  };

  return (
    <div>
      <div className="container">
        <main>
          <div className="main-content">
            <div className="arriba">
              <h2>Encuentra el servicio a mejor precio.</h2>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <i className="fas fa-search"></i> Buscar
                </button>
                <select value={modo} onChange={(e) => setModo(e.target.value)}>
                  <option value="Nombre">Nombre</option>
                  <option value="CategoriaNombre">Categoría</option>
                  <option value="UsuarioNombre">Usuario</option>
                </select>
              </div>
            </div>
            <div className="medio">
              <div className="btn-group">
                <button className="join-btn">Únete a Worky</button>
                {token ? (
                  <>
                  <a href="/crear-servicio">  
                  <button className="create-service-button">Crear Servicio</button>
                  </a>
                  </>
                ):(<></>)}
              </div>
            </div>
          </div>
        </main>

        <img src={trabajadorImg} alt='imagen_trabajador' className='img-container' />
      </div>

      {/* Nuevo contenedor para el carrusel */}
      <section className="categorias-carousel-container">
        <h3>Servicios populares</h3>
        <div className="carousel">
          <button className="carousel-btn left-btn" onClick={handlePrev}>{"<"}</button>
          <div className="carousel-track">
            {categoriasMadre.slice(currentIndex, currentIndex + itemsPerPage).map((categoria) => (
              <div className="carousel-item" key={categoria.id}>
                <img src={categoria.imagen || 'ruta/a/imagen/default.png'} alt={categoria.nombre} />
                <p>{categoria.nombre}</p>
              </div>
            ))}
          </div>
          <button className="carousel-btn right-btn" onClick={handleNext}>{">"}</button>
        </div>
        <a href="/categorias" className="ver-todas">Ver todas las categorías</a>
      </section>
    </div>
  );
};

export default Index;
