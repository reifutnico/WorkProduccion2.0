import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../css/PerfilServicio.css';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Función para formatear las horas sin tener en cuenta la zona horaria
const formatHour = (timeString) => {
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const diasDeLaSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useDisponibilidad = (id, dia, fechaSeleccionada) => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setDisponibilidad([]);
                setReservas([]);
                setError(null);

                const [disponibilidadResponse, reservasResponse] = await Promise.all([
                    axios.get(`http://localhost:5432/Servicio/Turnos/${id}?Dia=${dia}`),
                    axios.get(`http://localhost:5432/Servicio/TurnosReservados/${id}?Fecha=${fechaSeleccionada.toISOString().split('T')[0]}`)
                ]);

                console.log("Disponibilidad desde la API:", disponibilidadResponse.data.data);
                console.log("Reservas desde la API:", reservasResponse.data.data);

                if (disponibilidadResponse.data.data) {
                    setDisponibilidad(disponibilidadResponse.data.data);
                } else {
                    setDisponibilidad([]);
                }
                
                if (reservasResponse.data.data) {
                    setReservas(reservasResponse.data.data);
                } else {
                    setReservas([]);
                }
                
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
                setDisponibilidad([]);
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };
        if (id && dia && fechaSeleccionada) {
            obtenerDatos();
        }
    }, [id, dia, fechaSeleccionada]);

    return { disponibilidad, reservas, loading, error, setDisponibilidad };
};

const PerfilServicio = () => {
    const { id } = useParams(); 
    const { token } = useContext(UserContext);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [reservasEstado, setReservasEstado] = useState({});
    const diaSeleccionado = diasDeLaSemana[fechaSeleccionada.getDay()];
    const { disponibilidad, reservas, loading, error, setDisponibilidad } = useDisponibilidad(id, diaSeleccionado, fechaSeleccionada);

    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
    };

    const reservarTurno = async (idTurno) => {
        const fechaReserva = fechaSeleccionada.toISOString().split('T')[0]; 
        console.log(`Intentando reservar el turno con ID: ${idTurno} para la fecha: ${fechaReserva}`);
    
        try {
            console.log(token);
            const response = await axios.post(
                `http://localhost:5432/Servicio/Turnos/${idTurno}/reservar`, 
                { fechaReserva },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Reserva creada exitosamente:", response.data);
            setFechaSeleccionada(new Date(fechaSeleccionada));
        } catch (err) {
            console.error(`Error al reservar el turno con ID: ${idTurno}`, err.response ? err.response.data : err.message);
        }
    };
    
    const estaReservado = async (idTurno) => {
        const fechaSeleccionadaStr = fechaSeleccionada.toISOString().split('T')[0];
        console.log("Chequeando reserva para ID:", idTurno);
        console.log("Fecha seleccionada:", fechaSeleccionadaStr);

        try {
            const response = await axios.get(`http://localhost:5432/Servicio/TurnosReservados/${idTurno}?Fecha=${fechaSeleccionadaStr}`);
            const reservasEnTurno = response.data.data;
            console.log("Reservas encontradas:", reservasEnTurno);
            setReservasEstado(prevEstado => ({
                ...prevEstado,
                [idTurno]: reservasEnTurno.length > 0
            }));

            return reservasEnTurno.length > 0;
        } catch (err) {
            console.error("Error al verificar la reserva:", err.response ? err.response.data : err.message);
            return false;
        }
    };

    useEffect(() => {
        if (disponibilidad.length > 0) {
            disponibilidad.forEach(horario => {
                estaReservado(horario.id);
            });
        }
    }, [fechaSeleccionada, disponibilidad]);

    const minDate = new Date(); 

    return (
        <div className="calendar-container">
            <h2>Selecciona un día</h2>
            <Calendar 
                onChange={handleDateChange} 
                value={fechaSeleccionada} 
                minDate={minDate}
            />

            <div>
                <h3>Disponibilidad para el {fechaSeleccionada.toDateString()}</h3>
                {loading ? (
                    <p>Cargando horarios...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : disponibilidad.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Hora Desde</th>
                                <th>Hora Hasta</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disponibilidad.map((horario) => {
                                const reservado = reservasEstado[horario.id] || false;

                                // Formateo de horas usando la función personalizada
                                const horaComienzo = formatHour(horario.comienzo);
                                const horaFinal = formatHour(horario.final);

                                return (
                                    <tr
                                        key={horario.id}
                                        style={{
                                            backgroundColor: reservado ? "red" : "transparent",
                                            pointerEvents: reservado ? "none" : "auto"
                                        }}
                                    >
                                        <td>{horaComienzo}</td>
                                        <td>{horaFinal}</td>
                                        <td>{reservado ? "Reservado" : "Disponible"}</td>
                                        <td>
                                            {!reservado && (
                                                <button onClick={() => reservarTurno(horario.id)}>
                                                    Reservar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay disponibilidad para esta fecha.</p>
                )}
            </div>
        </div>
    );
};

export default PerfilServicio;
