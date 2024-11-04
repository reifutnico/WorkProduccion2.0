import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/TurnoReservadoInfo.css'
import { UserContext } from '../context/UserContext';

const TurnoReservadoInfo = () => {
    const { turnoReservadoId } = useParams();
    const [turnoInfo, setTurnoInfo] = useState(null);
    const { token } = useContext(UserContext);

    useEffect(() => {
        const fetchTurnoInfo = async () => {
            try {
                console.log(turnoReservadoId)
                console.log(token)
                const response = await axios.get(`http://localhost:5000/Servicio/turnoReservado/${turnoReservadoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                setTurnoInfo(response.data);
            } catch (error) {
                console.error('Error al obtener la información del turno reservado:', error);
            }
        };
        fetchTurnoInfo();
    }, [turnoReservadoId, token]);

    if (!turnoInfo) {
        return <p>Cargando información del turno...</p>;
    }

    return (
        <div>
            <h2>Información del Turno Reservado</h2>
            <p><strong>Contratador:</strong> {turnoInfo.nombreContratador}</p>
            <p><strong>Creador del Servicio:</strong> {turnoInfo.nombreCreadorServicio}</p>
            <p><strong>Servicio:</strong> {turnoInfo.nombreServicio}</p>
            <p><strong>Tipo de Servicio:</strong> {turnoInfo.tipoServicio}</p>
            <p><strong>Fecha:</strong> {turnoInfo.fecha}</p>
            <p><strong>Horario:</strong> {turnoInfo.comienzo} - {turnoInfo.final}</p>
            <p><strong>Ubicación:</strong> {turnoInfo.ubicacion}</p>
        </div>
    );
};

export default TurnoReservadoInfo;
