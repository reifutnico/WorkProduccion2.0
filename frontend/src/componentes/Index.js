import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Usar la URL completa con el puerto especificado
      const response = await axios.get('http://localhost:5432/Servicio/', {
        params: { Nombre: searchTerm }
      });
      const servicios = response.data;

      // Navegar a la página de resultados, pasando la búsqueda y los resultados
      navigate('/resultados', { state: { searchTerm, servicios } });
    } catch (error) {
      console.error("Error al buscar servicios:", error);
    }
  };

  return (
    <div className="container">
      <main>
        <div className="main-content">
          <h2>El mejor servicio, al mejor precio.</h2>
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
          </div>  
          <button className="join-btn">Únete a Worky</button>
          <img src="https://your-image-url.com/worker.png" alt="Worker" className="worker-image" />
        </div>
        <div className="create-service">
          <a href="/crear-servicio">
            <button className="create-service-button">Crear Servicio</button>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Index;
