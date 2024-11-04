import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import '../css/ServicesPages.css';

const ServicesPage = () => {
    const { user, token } = useContext(UserContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/servicios/contratados`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setServices(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los servicios');
                setLoading(false);
            }
        };
        fetchServices();
    }, [token]);

    if (loading) return <div>Cargando servicios...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Servicios Contratados</h1>
            {services.length > 0 ? (
                services.map((service) => (
                    <div key={service.id} className="service-card">
                        <img src={service.Foto} alt={service.Nombre} />
                        <h2>{service.Nombre}</h2>
                        <p>{service.Descripcion}</p>
                        <p>Precio: ${service.Precio}</p>
                    </div>
                ))
            ) : (
                <p>No tienes servicios contratados</p>
            )}
        </div>
    );
};

export default ServicesPage;
