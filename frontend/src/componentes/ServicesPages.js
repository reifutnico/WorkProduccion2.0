import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../css/ServicesPages.css';

const ServicesPage = () => {
    const { token } = useContext(UserContext);
    const [services, setServices] = useState([]);
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/Servicio/creados`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                setServices(response.data);
            } catch (error) {
                console.error('Error al cargar los servicios', error); // Manejo básico de errores
            }
        };
        fetchServices();
    }, [token]);

    const handleEditAvailability = (idServicio) => {
        navigate(`/horario?id=${idServicio}`); // Navega a la página de horario para editar disponibilidad
    };

    return (
        <div>
            <h1>Servicios creados</h1>
            {services.length > 0 ? (
                services.map((service) => (
                    <div key={service.id} className="service-card">
                        <img src={service.Foto} alt={service.Nombre} />
                        <h2>{service.Nombre}</h2>
                        <p>{service.Descripcion}</p>
                        <p>Precio: ${service.Precio}</p>
                        <button onClick={() => handleEditAvailability(service.id)}>Editar Disponibilidad</button> {/* Botón para editar disponibilidad */}
                    </div>
                ))
            ) : (
                <p>No tienes servicios creados</p>
            )}
        </div>
    );
};

export default ServicesPage;
