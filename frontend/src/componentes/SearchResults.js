import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SearchResults.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SearchResults = () => {
  const location = useLocation();
  const { searchTerm, servicios } = location.state;
  const [searchTerm2, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      // Usar la URL completa con el puerto especificado
      const response = await axios.get('http://localhost:5432/Servicio/', {
        params: { CategoriaNombre: searchTerm2 }
      });
      const servicios = response.data;

      // Navegar a la página de resultados, pasando la búsqueda y los resultados
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
  );}

const ServiceCard = ({ service }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    
    <div className="card service-item">
      <div className="image-container">
        {service.Foto ? (
          <img src={service.Foto} alt={service.Nombre} className="service-image" />
        ) : (
          <div className="service-placeholder">No Image Available</div>
        )}
        <div
          className={`heart-icon ${liked ? 'liked' : ''}`}
          onClick={toggleLike}
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
