import React from 'react';

import './css/App.css';
import Horario from './componentes/Horario';
import CrearServicio from './componentes/CreateService';
import Index from  './componentes/Index';
import Navbar from  './componentes/Navbar';


function App() {
  return (
    <>
    <Index/>
    <CrearServicio/>
    <Horario /> 
    <Navbar /> 

      
    </>
  );
}

export default App;
