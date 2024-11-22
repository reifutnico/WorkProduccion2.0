import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../css/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            window.location.reload();
        } catch (error) {
            setErrorMessage('Error en el inicio de sesión');
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
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                    <button type="submit" className="form-button">
                        Log In
                    </button>
                </form>
                <p>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
