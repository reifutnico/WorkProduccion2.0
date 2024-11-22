import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import logo from '../img/worky_logo.png';
import Modal from './modal';
import ModalNotificaciones from './modalNotificaciones';
import { format } from 'date-fns';
import Login from './login';
import { UserContext } from '../context/UserContext';
import { FaBell } from 'react-icons/fa';
import HamburgerMenu from './HamburgerMenu'; // Importa el componente del menú hamburguesa

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categoriasMadre, setCategoriasMadre] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [hasData, setHasData] = useState(false);

  const { token, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriasMadre = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Categoria/categoriasMadre');
        setCategoriasMadre(response.data);
      } catch (error) {
        console.error('Error al buscar CategoriasMadre:', error);
      }
    };
    fetchCategoriasMadre();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Servicio/turnoPendiente', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al buscar :', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    setHasData(data.length > 0);
  }, [data]);

  const confirmarTurno = async (nuevoEstado, idTurnoReservado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Servicio/turnoPendiente/${idTurnoReservado}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { estado: nuevoEstado },
        }
      );
      console.log('Reserva confirmada:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error al confirmar turno:', error);
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
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleSearch = async (categoriaNombre) => {
    try {
      const params = { 'CategoriaNombre': categoriaNombre };
      const response = await axios.get(`http://localhost:5000/Servicio/`, { params });
      const servicios = response.data;
      navigate('/resultados', { state: { searchTerm: categoriaNombre, servicios } });
    } catch (error) {
      console.error('Error al buscar servicios:', error);
    }
  };
  const handleMenuOptionClick = (option) => {
    // Lógica para manejar la opción seleccionada en el menú
    switch (option) {
      case 'perfil':
        navigate('/perfil');
        break;
      case 'servicios':
        navigate('/ServiciosContratados');
        break;
      case 'mis-servicios':
        navigate('/ServicesPages ');
        break;
      default:
        break;
    }
  };
  
  const handleNot = async () => {
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
          <>
            <div
              className={`notification-bell ${hasData ? 'red' : ''}`}
              onClick={handleNot}>
              <FaBell size={24} />
              {data.length > 0 && <p>{data.length}</p>}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
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

      {/* Usando el menú hamburguesa como componente */}
      <HamburgerMenu
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        handleMenuOptionClick={(option) => handleMenuOptionClick(option)}
      />

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} title="Log In">
        <Login />
      </Modal>

      <ModalNotificaciones isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notificaciones">
        <div className="notifications-content">
          {data.length === 0 ? (
            <p>No tienes turnos reservados.</p>
          ) : (
            data.map((turnoReservado, index) => {
              const fechaObj = new Date(turnoReservado.fecha);
              fechaObj.setHours(fechaObj.getHours() + 3);

              const comienzoObj = new Date(turnoReservado.comienzo);
              comienzoObj.setHours(comienzoObj.getHours() + 3);

              const finalObj = new Date(turnoReservado.final);
              finalObj.setHours(finalObj.getHours() + 3);

              const fecha = format(fechaObj, 'dd/MM/yyyy');
              const formatHourMinute = (date) => {
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
              };
              const comienzo = formatHourMinute(comienzoObj);
              const final = formatHourMinute(finalObj);

              return (
                <div key={index} className="turno-item">
                  <h3 className="turno-title">Turno a confirmar</h3>
                  <div className="modal-items">
                    <div className="modal-item">
                      <p><strong>Servicio:</strong> {turnoReservado.Nombre}</p>
                      <p><strong>Fecha:</strong> {fecha}</p>
                    </div>
                    <div className="modal-item">
                      <p><strong>Comienzo:</strong> {comienzo}</p>
                      <p><strong>Final:</strong> {final}</p>
                    </div>
                    <div className="buttons-container">
                      <button className="aceptar-btn" onClick={() => confirmarTurno(1, turnoReservado.idTurno)}>Aceptar</button>
                      <button className="rechazar-btn" onClick={() => confirmarTurno(0, turnoReservado.idTurno)}>Rechazar</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ModalNotificaciones>
    </nav>
  );
};

export default Navbar;
