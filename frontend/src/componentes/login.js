import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

function Login() { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5432/api/user/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const token = response.data.token; 
                localStorage.setItem('token', JSON.stringify(token));
                const userResponse = await axios.get('http://localhost:5432/api/login/token', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });
                if (userResponse.status === 200) {
                    const userData = userResponse.data;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    navigate('/'); 
                }
            }
        } catch (error) {
            setErrorMessage('Error en el inicio de sesión');
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log In</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
                <p>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;