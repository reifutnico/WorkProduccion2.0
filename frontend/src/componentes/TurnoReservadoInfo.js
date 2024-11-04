import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/TurnoReservadoInfo.css';
import { UserContext } from '../context/UserContext';

const TurnoReservadoInfo = () => {
    const { turnoReservadoId } = useParams();
    const [turnoInfo, setTurnoInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(UserContext);

    useEffect(() => {
        const fetchTurnoInfo = async () => {
            if (!token || !turnoReservadoId) return;
            try {
                console.log("ID del Turno:", turnoReservadoId);
                console.log("Token:", token);
                const response = await axios.get(`http://localhost:5000/Servicio/turnoReservado/${turnoReservadoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data;
                const fechaObj = new Date(data.fecha);
                fechaObj.setHours(fechaObj.getHours() + 3);
                const comienzoObj = new Date(data.comienzo);
                comienzoObj.setHours(comienzoObj.getHours() + 3);
                const finalObj = new Date(data.final);
                finalObj.setHours(finalObj.getHours() + 3);
                const formattedFecha = `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}`;
                const formatHourMinute = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                const formattedComienzo = formatHourMinute(comienzoObj);
                const formattedFinal = formatHourMinute(finalObj);

                setTurnoInfo({
                    ...data,
                    fecha: formattedFecha,
                    comienzo: formattedComienzo,
                    final: formattedFinal,
                });
            } catch (error) {
                console.error('Error al obtener la información del turno reservado:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnoInfo();
    }, [turnoReservadoId, token]);

    if (loading) {
        return <p>Cargando información del turno...</p>;
    }

    if (!turnoInfo) {
        return <p>Error al cargar la información del turno reservado.</p>;
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
