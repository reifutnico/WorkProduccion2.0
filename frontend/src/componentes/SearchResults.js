import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm, servicios } = location.state;

  return (
    <div className="container">
      <h2>Resultados para "{searchTerm}"</h2>
      <div className="services-list">
        {servicios.length > 0 ? (
          servicios.map(service => (
            <div key={service.id} className="service-item">
              {service.Foto ? (
                <img src={service.Foto} alt={service.Nombre} className="service-image" />
              ) : (
                <div className="service-placeholder">No Image Available</div>
              )}
              <h3>{service.Nombre}</h3>
              <p>{service.Descripcion}</p>
              <p>Categoría: {service.CategoriaNombre}</p>
              <p>Creado por: {service.CreadorNombre}</p>
              <p>Precio: ${service.Precio}</p>
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
