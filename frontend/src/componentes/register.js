import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css'; // Asegúrate de que el archivo CSS esté bien importado

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/account/register', {
        username: username,
        email: email,
        telefono: telefono,
        fechaNacimiento: fechaNacimiento,
        fotoPerfil: fotoPerfil,
        password: password,
      });

      if (response.status === 201) {
        navigate('/confirm');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && typeof error.response.data.error === 'string') {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Error');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Nombre</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              className="form-input"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              className="form-input"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="fotoPerfil">Foto de Perfil</label>
            <input
              type="file"
              id="fotoPerfil"
              className="form-input"
              accept="image/*"
              onChange={(e) => setFotoPerfil(e.target.files[0])}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-button">Registrar</button>
        </form>
        <p>
          ¿Ya tienes una cuenta? <Link to="/Login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
