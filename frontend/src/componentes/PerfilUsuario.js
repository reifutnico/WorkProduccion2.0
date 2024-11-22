import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado
import '../css/PerfilUsuario.css';
import { UserContext } from '../context/UserContext';

const PerfilUsuario = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(UserContext);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log(token);
                const response = await axios.get("http://localhost:5000/api/account/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                setUserData(response.data.data); // Almacena los datos del usuario
                setLoading(false);
            } catch (err) {
                setError("Error al cargar el perfil del usuario");
                console.log(err);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    if (loading) {
        return <div className="perfil-container">Cargando...</div>;
    }

    if (error) {
        return <div className="perfil-container error">{error}</div>;
    }

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <img
                    src={userData.fotoPerfil || "/default-avatar.jpg"} // Imagen por defecto si no tiene foto de perfil
                    alt="Foto de perfil"
                    className="perfil-foto"
                />
                <h1 className="perfil-titulo">Perfil de Usuario</h1>
            </div>
            <div className="perfil-info">
                <p><strong>Nombre de usuario:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Teléfono:</strong> {userData.telefono || "No especificado"}</p>
                <p><strong>Fecha de nacimiento:</strong> {new Date(userData.fechaNacimiento).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default PerfilUsuario;
