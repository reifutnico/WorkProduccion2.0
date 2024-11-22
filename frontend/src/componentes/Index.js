import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Asegúrate de importar el contexto
import trabajadorImg from '../img/trabajadorIndex.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css';
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
  Programador: programadorImg,
};

const ITEMS_PER_SCROLL = 1; // Avanzar solo un ítem por clic

const Index = () => {
  const [isMember, setIsMember] = useState(false); // Almacena si es miembro
  const [searchTerm, setSearchTerm] = useState("");
  const [modo, setModo] = useState("Nombre");
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselTrackRef = useRef(null);
  const { token, verificarMiembro, joinWorky } = useContext(UserContext); // Importa joinWorky

  const navigate = useNavigate();

  // Verificar si el usuario es miembro
  useEffect(() => {
    const verificarEstadoDeMiembro = async () => {
      if (token) {
        try {
          const result = await verificarMiembro(token);
          setIsMember(result);
        } catch (error) {
          console.error('Error al verificar el estado de miembro:', error);
        }
      }
    };

    verificarEstadoDeMiembro();
  }, [token, verificarMiembro]);

  useEffect(() => {
    const fetchCategoriasMadre = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Categoria/categoriasMadre');
        setCategoriasMadre([...response.data, ...response.data, ...response.data]);
      } catch (error) {
        console.error('Error al buscar CategoriasMadre:', error);
      }
    };
    fetchCategoriasMadre();
  }, []);

  const handleNext = () => {
    const carouselTrack = carouselTrackRef.current;
    const itemWidth = carouselTrack.children[0].offsetWidth + 20; // Ancho de cada elemento más el margen
    const maxScroll = carouselTrack.scrollWidth - carouselTrack.offsetWidth;

    if (carouselTrack.scrollLeft + itemWidth < maxScroll) {
      carouselTrack.scrollLeft += itemWidth;
      setCurrentIndex((prevIndex) => prevIndex + ITEMS_PER_SCROLL);
    } else {
      carouselTrack.scrollLeft = 0;
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    const carouselTrack = carouselTrackRef.current;
    const itemWidth = carouselTrack.children[0].offsetWidth + 20; // Ancho de cada elemento más el margen

    if (carouselTrack.scrollLeft > 0) {
      carouselTrack.scrollLeft -= itemWidth;
      setCurrentIndex((prevIndex) => prevIndex - ITEMS_PER_SCROLL);
    } else {
      carouselTrack.scrollLeft = carouselTrack.scrollWidth - carouselTrack.offsetWidth;
      setCurrentIndex(Math.floor((carouselTrack.scrollWidth - carouselTrack.offsetWidth) / itemWidth));
    }
  };

  const handleSearch = async () => {
    try {
      const params = { [modo]: searchTerm };
      const response = await axios.get(`http://localhost:5000/Servicio/`, { params });
      const servicios = response.data;
      navigate('/resultados', { state: { searchTerm, servicios } });
    } catch (error) {
      console.error('Error al buscar servicios:', error);
    }
  };

  const handleJoinWorky = async () => {
    try {
      const result = await joinWorky(); 
      if (result) {
        setIsMember(true);
      }
    } catch (error) {
      console.error('Error al unirse a Worky:', error);
    }
  };

  return (
    <div>
      <div className="container">
        <main className='main-content-wrapper'>
          <div className="main-content">
            <div className="arriba">
              <h2 className='main-arriba'>Encuentra el servicio a mejor precio.</h2>
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
                {token && (
                  isMember ? (
                    <a href="/crear-servicio">
                      <button className="create-service-button">Crear Servicio</button>
                    </a>
                  ) : (
                    <button className="join-btn" onClick={handleJoinWorky}>Únete a Worky</button>
                  )
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
          <button
            className="custom-carousel-btn custom-left-btn"
            onClick={handlePrev}
          >
            {"<"}
          </button>
          <div className="custom-carousel-track" ref={carouselTrackRef}>
            {categoriasMadre.map((categoria, index) => (
              <div
                className="custom-carousel-item"
                key={categoria.id}
                style={{
                  transform: `translateX(-${(currentIndex * ITEMS_PER_SCROLL + index) * 100 / categoriasMadre.length}%)`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <img
                  src={imagenesCategoria[categoria.nombre] || 'ruta/a/imagen/default.png'}
                  alt={categoria.nombre}
                />
                <p className="custom-carousel-name">{categoria.nombre}</p>
              </div>
            ))}
          </div>
          <button
            className="custom-carousel-btn custom-right-btn"
            onClick={handleNext}
          >
            {">"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;
