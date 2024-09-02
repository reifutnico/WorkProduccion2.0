import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm, servicios } = location.state;

  return (
    <div className="container2">
      <h2>Resultados para "{searchTerm}"</h2>
      <div className="services-list">
        {servicios.length > 0 ? (
          servicios.map(service => (
            <div key={service.id} className="card service-item">
              <div className="image-container">
                {service.Foto ? (
                  <img src={service.Foto} alt={service.Nombre} className="service-image" />
                ) : (
                  <div className="service-placeholder">No Image Available</div>
                )}
                <div className="heart-icon">❤</div>
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
          ))
        ) : (
          <p className="no-services">No se encontraron servicios.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
