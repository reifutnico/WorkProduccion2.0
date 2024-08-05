import React from 'react';
import '../css/index.css';
import logo from '../img/worky_logo.png'; // Importa la imagen del logo

const Index = () => {
  return (
    <div className="container">

      <main>
        <div className="search-section">
          <h1>Encuentra el servic
            io que buscas</h1>
          <div className="search-bar">
            <input type="text" placeholder="Buscar un servicio..." />
            <button className="search-btn"><i className="fa fa-search"></i></button>
          </div>
        </div>

        <div className="main-content">
          <h2>El mejor servicio, al mejor precio.</h2>
          <button className="join-btn">Únete a Worky</button>
          <img src="https://your-image-url.com/worker.png" alt="Worker" className="worker-image" />
        </div>
      </main>
    </div>
  );
}

export default Index;
