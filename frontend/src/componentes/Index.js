import React from 'react';
import '../css/index.css';

const Index = () => {
  return (
    <div className="container">
      <main>
     

        <div className="main-content">
          <h2>El mejor servicio, al mejor precio.</h2>
          <div className="search-bar">
    <input type="text" placeholder="Buscar..." />
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
        


      </main>
    </div>
  );
}

export default Index;
