import React, { useState } from 'react';

import './css/App.css';
import Horario from './componentes/horario.js';
import CrearServicio from './componentes/CreateService';
import Index from  './componentes/Index';
import Navbar from  './componentes/Navbar';

function App() 
{

  return (
    <>
    <Index/>
    <CrearServicio/>
    <Horario/> 
    <Navbar />
    <ServicesPages/>
    </>
  );
}

export default App;
