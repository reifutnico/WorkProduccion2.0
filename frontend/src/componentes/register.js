import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

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
      const response = await axios.post('http://localhost:5432/api/account/register', {
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
          <input
            type="text"
            placeholder="Nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoPerfil(e.target.files[0])} 
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/Login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
