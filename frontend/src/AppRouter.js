import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateService from './componentes/CreateService';
import Horario from './componentes/Horario';
import Navbar from './componentes/Navbar';
import Index from './componentes/Index';


const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<CreateService />} />
      <Route path="/horario" element={<Horario />} />
      <Route path="/Navbar" element={<Navbar />} />
      <Route path="/Index" element={<Index />} />

    </Routes>
  </Router>
);

export default AppRouter;
