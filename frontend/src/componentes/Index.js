import React, { useState } from 'react';
import trabajadorImg from '../img/trabajadorIndex.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modo, setModo] = useState("Nombre");
  const navigate = useNavigate();
  const handleSearch = async () => {
    try {
      const params = {
        [modo]: searchTerm
      };
      const response = await axios.get(`http://localhost:5432/Servicio/`, { params });
      console.log(modo, searchTerm, response.data)
      const servicios = response.data;
      navigate('/resultados', { state: { searchTerm, servicios } });
    } catch (error) {
      console.error("Error al buscar servicios:", error);
    }
  };

  return (
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
          <h3>Encuentra el servicio a mejor precio.</h3>
          <button className="join-btn">Únete a Worky</button>
          <div className="create-service">
          <a href="/crear-servicio">
            <button className="create-service-button">Crear Servicio</button>
          </a>
        </div>
        </div>
        </div>  

      </main>
      <img src={trabajadorImg} alt='imagen_trabajador' className='img-container'></img>

    </div>
    
  );
}

export default Index;
