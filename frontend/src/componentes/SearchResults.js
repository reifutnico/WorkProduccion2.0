import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/SearchResults.css';
import axios from 'axios';


const SearchResults = () => {
  const location = useLocation();
  let { searchTerm, servicios } = location.state;
  const [modo, setModo] = useState("Nombre");
  const [searchTerm2, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      const params = {
        [modo]: searchTerm2
      };
      const response = await axios.get('http://localhost:5432/Servicio/', { params });
      const servicios = response.data;
      searchTerm = searchTerm2;
      navigate('/resultados', { state: { searchTerm, servicios } });
    } catch (error) {
      console.error("Error al buscar servicios:", error);
    }
  };

  return (
    <div className="container2">
      <div className="search-bar2">
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={searchTerm2}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn2" onClick={handleSearch}>
          <i className="fas fa-search"></i> Buscar
        </button>
        <select value={modo} onChange={(e) => setModo(e.target.value)}>
          <option value="Nombre">Nombre</option>
          <option value="CategoriaNombre">Categoría</option>
          <option value="UsuarioNombre">Usuario</option>
        </select>
      </div>
  
      <div className="result-container">
        <h2 className="result-title">Resultados para "{searchTerm}"</h2>
        <h2 className="search-term">{searchTerm}</h2>
        <h3 className="order-by-text">En orden por</h3>
      </div>
  
      <div className="services-list">
        {servicios.length > 0 ? (
          servicios.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <p className="no-services">No se encontraron servicios.</p>
        )}
      </div>
    </div>
  );
};

const ServiceCard = ({ service }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const toggleLike = () => {
    setLiked(!liked);
  };

  // Nueva función para manejar el clic y la navegación a la ruta de perfil
  const handleCardClick = () => {
    navigate(`/perfil-servicio/${service.id}`);
  };

  return (
    <div className="card service-item" onClick={handleCardClick}>
      <div className="image-container">
        {service.Foto ? (
          <img src={service.Foto} alt={service.Nombre} className="service-image" />
        ) : (
          <div className="service-placeholder">No Image Available</div>
        )}
        <div
          className={`heart-icon ${liked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Evita que se dispare la navegación al hacer clic en el corazón
            toggleLike();
          }}
        >
          ❤
        </div>
      </div>
      <div className="info">
        <h3 className="service-name">{service.Nombre}</h3>
        <p className="Category">{service.CategoriaNombre}</p>
        <div className="price-rating">
          <div className="price">{service.Precio}$</div>
          <div className="rating">★ {service.Calificacion} ({service.Votos})</div>
        </div>
      </div>
      <p className="description">{service.Descripcion}</p>
    </div>
  );
};

export default SearchResults;
