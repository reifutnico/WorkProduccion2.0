import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/index.css';

const Index = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    // Fetch services when the component mounts
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5432/Servicio/', {
          params: { Nombre: searchQuery }
        });
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [searchQuery]); // Refetch when searchQuery changes

  useEffect(() => {
    // Filter services based on the search query
    setFilteredServices(
      services.filter(service =>
        // Check if ServicioNombre includes the searchQuery
        service.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [services, searchQuery]);

  return (
    <div className="container">
      <main>
        <div className="main-content">
          <h2>El mejor servicio, al mejor precio.</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <i className="fas fa-search"></i> Buscar
            </button>
          </div>
          <button className="join-btn">Únete a Worky</button>
          <img src="https://your-image-url.com/worker.png" alt="Worker" className="worker-image" />
        </div>
        <div className="create-service">
          <a href="/crear-servicio">
            <button className="create-service-button">Crear Servicio</button>
          </a>
        </div>
        <div className="services-list">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service.id} className="service-item">
              {service.Foto ? (
                <img src={service.Foto} alt={service.ServicioNombre} className="service-image" />
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
      </main>
    </div>
  );
}

export default Index;
