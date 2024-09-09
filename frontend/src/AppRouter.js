import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateService from './componentes/CreateService';
import Horario from './componentes/horario';
import Navbar from './componentes/Navbar';
import Index from './componentes/Index';
import PerfilServicio from './componentes/PerfilServicio';

import SearchResults from './componentes/SearchResults';


const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/crear-servicio" element={<CreateService />} />
      <Route path="/horario" element={<Horario />} />
      <Route path="/resultados" element={<SearchResults />} />
      <Route path="/perfil-servicio/:id" element={<PerfilServicio />} />
    </Routes>
  </Router>
);

export default AppRouter;
