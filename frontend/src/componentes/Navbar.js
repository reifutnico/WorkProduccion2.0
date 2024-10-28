// Navbar.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import ModalNotificaciones from './modalNotificaciones';
import { format } from 'date-fns'; // Asegúrate de instalar date-fns
import Login from './login';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [data, setData] = useState({
    turnosReservados: [],
    turnos: [],
    servicios: []
  });
  const [error, setError] = useState(null);

  const { token, user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriasMadre = async () => {
      try {
        const response = await axios.get('http://localhost:5432/Categoria/categoriasMadre');
        setCategoriasMadre(response.data);
      } catch (error) {
        console.error('Error al buscar CategoriasMadre:', error);
      }
    };
    fetchCategoriasMadre();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5432/Servicio/turnoPendiente', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      console.log(response.data);    
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleMouseEnter = (categoriaMadre) => {
    setDropdown(categoriaMadre.id);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };


  const handleLogout = () => {
    logout();
    navigate("/");
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };



  const handleSearch = async () => {
    if (token) {
      await fetchData();
      setNotificationsOpen(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="Worky Logo" className="navbar-logo-img" />
        </a>
      </div>
      <ul className="navbar-menu">
        {categoriasMadre.map((categoria) => (
          <li
            key={categoria.id}
            className="navbar-item"
            onMouseEnter={() => handleMouseEnter(categoria)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleSearch(categoria.nombre)}
          >
            {categoria.nombre}
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <div className="navbar-buttons">
            <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
            <a href="/register">
              <button className="signup-btn">Register</button>
            </a>
          </div>
        )}
        <div className="hamburger-icon" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <span className="close-menu" onClick={toggleMenu}>&times;</span>
        <div className="menu-content">
          <a href="#">Mi perfil</a>
          <a href="#">Mis servicios</a>
          <a href="#">Mis pagos</a>
          <a href="#">Próximas citas</a>
          <a href="#" onClick={handleLogout}>Cerrar sesión</a>
        </div>
      </div>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
        <Login />
      </Modal>

      {/* Modal de Notificaciones */}

<ModalNotificaciones isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notificaciones">
  {error ? (
    <p>Error: {error}</p>
  ) : (
    <div className="notifications-content">
      {data.turnosReservados && Array.isArray(data.turnosReservados) && data.turnosReservados.length === 0 ? (
        <p>No tienes turnos reservados.</p>
      ) : (
        data.turnosReservados && Array.isArray(data.turnosReservados) && data.turnosReservados.map((turnoReservado, index) => {
          const turno = data.turnos.find(t => t.id === turnoReservado.idTurno);
          const servicio = data.servicios.find(s => s.id === turno.idDisponibilidad);
          
          // Convertir la fecha a un formato legible
          const fecha = format(new Date(turnoReservado.fecha), 'dd/MM/yyyy');
          const estado = turnoReservado.estado === 0 ? 'Pendiente' : 'Confirmado'; // Asumiendo que 0 es pendiente
          const comienzo = format(new Date(turno.comienzo), ' HH:mm');
          const final = format(new Date(turno.final), 'HH:mm');
          
          return (
            <div key={index} className="turno-item">
              <h3 className="turno-title">Turno a confirmar</h3>
              <div className="modal-items">
                <div className="modal-item">
                  <p><strong>Fecha:</strong> {fecha}</p>
                  <p><strong>Estado:</strong> {estado}</p>
                </div>
                {turno && (
                  <div className="modal-item">
                    <p><strong>Comienzo:</strong> {comienzo}</p>
                    <p><strong>Final:</strong> {final}</p>
                  </div>
                )}
                {servicio && (
                  <div className="modal-item">
                    <p><strong>Día:</strong> {servicio.Dia}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  )}
</ModalNotificaciones>
    </nav>
  );
};

export default Navbar;
