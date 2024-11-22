import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [miembro, setmiembro] = useState(null);
    const [convertir, setconvertirMiembro] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                setToken(JSON.parse(storedToken));
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error al parsear los datos del localStorage:", error);
            }
        }
    }, []);

    const login = async (username, password) => {
        try {
            console.log(username, password)
            const response = await axios.post('http://localhost:5000/api/account/login', {
                username, 
                password,
            });

            if (response.status === 200) {
                const receivedToken = response.data.token;
                const resultUser = response.data.user;
                setToken(receivedToken);
                setUser(resultUser);
                localStorage.setItem('token', JSON.stringify(receivedToken));
                localStorage.setItem('user', JSON.stringify(resultUser));
            }
        } catch (error) {
            console.error('Error en el inicio de sesión', error);
            throw new Error('Login failed');
        }
    };
    const verificarMiembro = async (token) => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/account/verificarMiembro',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                const esMiembro = response.data.miembro; 
                setmiembro(esMiembro);
                return esMiembro; 
            }
        } catch (error) {
            console.error('Error al verificar si eres miembro:', error);
            throw new Error('Verification failed');
        }
    };
    

    const convertirMiembro = async (token) => {
        try {
            const response = await axios.put(
                'http://localhost:5000/api/account/convertirMiembro',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const convertirMiembro = response.data.miembro; 
                setconvertirMiembro(convertirMiembro);
                return convertir; 
            }
        } catch (error) {
            console.error('Error al verificar si eres miembro:', error);
            throw new Error('Verification failed');
        }
    };
    


    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const joinWorky = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/Servicio/miembro',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                const updatedUser = { ...user, miembro: true };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al unirse a Worky:', error);
            throw new Error('Failed to join Worky');
        }
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout, joinWorky,verificarMiembro,convertirMiembro}}>
            {children}
        </UserContext.Provider>
    );
};