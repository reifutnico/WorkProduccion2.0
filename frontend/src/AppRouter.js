import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateService from './componentes/CreateService';
import Horario from './componentes/horario';
import Navbar from './componentes/Navbar';
import Index from './componentes/Index';
import PerfilServicio from './componentes/PerfilServicio';
import SearchResults from './componentes/SearchResults';
import Login from './componentes/login';
import Register from './componentes/register';
import Confirm from './componentes/confirm';
import ConfirmToken from './componentes/confirmToken';
import { UserProvider} from './context/UserContext'; 
import TurnoReservadoInfo from './componentes/TurnoReservadoInfo.js';
import ServicesPage from './componentes/ServicesPages.js'
import ServiciosContratados from './componentes/ServiciosContratados.js';
import PerfilUsuario from './componentes/PerfilUsuario.js';

const AppRouter = () => (
  <UserProvider>
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/crear-servicio" element={<CreateService />} />
      <Route path="/horario" element={<Horario />} />
      <Route path="/resultados" element={<SearchResults />} />
      <Route path="/perfil-servicio/:id" element={<PerfilServicio />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/confirm/:token" element={<ConfirmToken />} />
      <Route path="/ServicesPages" element={<ServicesPage />} />
      <Route path="/turnoReservadoInfo/:turnoReservadoId" element={<TurnoReservadoInfo />} />
      <Route path="/ServiciosContratados" element={<ServiciosContratados />} />
      <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
    </Routes>
  </Router>
  </UserProvider>

);

export default AppRouter;
