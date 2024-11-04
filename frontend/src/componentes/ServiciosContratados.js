import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ServicesPages.css';

const ServiciosContratados = () => {
    const { token } = useContext(UserContext);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/Servicio/contratados`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setServices(response.data);
                console.log("Servicios obtenidos:", response.data);
            } catch (error) {
                console.error('Error al cargar los servicios', error);
            }
        };
        fetchServices();
    }, [token]);

    // Función para formatear fecha y hora
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formato de fecha local
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // Formato de tiempo hh:mm AM/PM
    };

    const handleEditAvailability = (idServicio) => {
        navigate(`/perfil-servicio/${idServicio}`);
    }
    return (
        <div>
            <h1>Servicios contratados</h1>
            {services.length > 0 ? (
                services.map((service) => (
                    <div key={service.turnoReservadoId} className="service-card">
                        <h2>{service.nombreServicio}</h2>
                        <p><strong>Contratador:</strong> {service.nombreContratador}</p>
                        <p><strong>Creador del Servicio:</strong> {service.nombreCreadorServicio}</p>
                        <p><strong>Tipo de Servicio:</strong> {service.tipoServicio}</p>
                        <p><strong>Fecha:</strong> {formatDateTime(service.fecha)}</p>
                        <p><strong>Hora de Inicio:</strong> {formatTime(service.comienzo)}</p>
                        <p><strong>Hora de Fin:</strong> {formatTime(service.final)}</p>
                        <p><strong>Ubicación:</strong> {service.ubicacion}</p>
                        <button onClick={() => handleEditAvailability(service.idServicio)}>Ir a servicio</button>
                    </div>
                ))
            ) : (
                <p>No tienes servicios contratados</p>
            )}
        </div>
    );
};

export default ServiciosContratados;

