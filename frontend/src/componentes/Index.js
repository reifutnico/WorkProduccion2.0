import React, { useState, useEffect, useContext } from 'react';
import trabajadorImg from '../img/trabajadorIndex.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css';
import { UserContext } from '../context/UserContext';
import artistaImg from '../img/artista.jpg';
import entrenadorImg from '../img/entrenador.jpg';
import gasistasImg from '../img/gasistas.jpg';
import plomeriaImg from '../img/plomeria.jpg';
import programadorImg from '../img/programador.jpg';

const imagenesCategoria = {
  Plomeria: plomeriaImg,
  Artista: artistaImg,
  Gasistas: gasistasImg,
  Entrenador: entrenadorImg,
  Programador: programadorImg
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modo, setModo] = useState("Nombre");
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 3;
  const { token, user, joinWorky } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      console.log(user.miembro);
    }
  }, [user]);

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

  const handleJoinWorky = async () => {
    try {
      const success = await joinWorky();
      if (success) {
        alert('Bienvenido a workyyyy');
      }
    } catch (error) {
      alert('Hubo un error al unirse a Worky. Por favor, intente nuevamente.');
    }
  };

  const handleNext = () => {
    if (currentIndex < categoriasMadre.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
                {token && !user?.miembro && (
                  <button className="join-btn" onClick={handleJoinWorky}>
                    Únete a Worky
                  </button>
                )}
                {token && user?.miembro && (
                  <a href="/crear-servicio">
                    <button className="create-service-button">Crear Servicio</button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </main>
        <img src={trabajadorImg} alt="imagen_trabajador" className="img-container" />
      </div>

      <section className="popular-services-carousel-container">
        <h3>Servicios populares</h3>
        <div className="custom-carousel">
          <button className="custom-carousel-btn custom-left-btn" onClick={handlePrev}>
            {"<"}
          </button>
          <div
            className="custom-carousel-track"
            style={{ transform: `translateX(-${currentIndex * 210}px)` }}
          >
            {categoriasMadre.slice(currentIndex, currentIndex + itemsPerPage).map((categoria) => (
              <div className="custom-carousel-item" key={categoria.id}>
                <img
                  src={imagenesCategoria[categoria.nombre] || 'ruta/a/imagen/default.png'}
                  alt={categoria.nombre}
                />
                <p className="custom-carousel-name">{categoria.nombre}</p>
              </div>
            ))}
          </div>
          <button className="custom-carousel-btn custom-right-btn" onClick={handleNext}>
            {">"}
          </button>
        </div>
        <a href="/categorias" className="view-all-categories">Ver todas las categorías</a>
      </section>
    </div>
  );
};

export default Index;