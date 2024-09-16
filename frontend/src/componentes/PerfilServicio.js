import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../css/PerfilServicio.css';
import { useParams } from 'react-router-dom';

const diasDeLaSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useDisponibilidad = (id, dia, fechaSeleccionada) => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                // Limpiar datos anteriores
                setDisponibilidad([]);
                setReservas([]);
                setError(null);

                // Obtener disponibilidad y reservas
                const [disponibilidadResponse, reservasResponse] = await Promise.all([
                    axios.get(`http://localhost:5432/Servicio/Turnos/${id}?Dia=${dia}`),
                    axios.get(`http://localhost:5432/Servicio/TurnosReservados/${id}?Fecha=${fechaSeleccionada.toISOString().split('T')[0]}`)
                ]);

                // Actualizar estado con la respuesta de disponibilidad
                if (disponibilidadResponse.data.data) {
                    setDisponibilidad(disponibilidadResponse.data.data);
                } else {
                    setDisponibilidad([]);
                }
                
                // Actualizar estado con la respuesta de reservas
                if (reservasResponse.data.data) {
                    setReservas(reservasResponse.data.data);
                } else {
                    setReservas([]);
                }
                
            } catch (err) {
                // Manejar el error y actualizar el estado de error
                setError(err.response ? err.response.data.message : err.message);
                setDisponibilidad([]); // Limpiar disponibilidad en caso de error
                setReservas([]); // Limpiar reservas en caso de error
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
    const { id } = useParams(); // Este es el id del servicio
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [reservasEstado, setReservasEstado] = useState({}); // Para almacenar el estado de reserva de cada turno
    const diaSeleccionado = diasDeLaSemana[fechaSeleccionada.getDay()];
    const { disponibilidad, reservas, loading, error, setDisponibilidad } = useDisponibilidad(id, diaSeleccionado, fechaSeleccionada);

    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
    };

    const reservarTurno = async (idTurno) => {
        const fechaReserva = fechaSeleccionada.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
        console.log(`Intentando reservar el turno con ID: ${idTurno} para la fecha: ${fechaReserva}`);

        try {
            const response = await axios.post(`http://localhost:5432/Servicio/Turnos/${idTurno}/reservar`, { fechaReserva });
            console.log("Reserva creada exitosamente:", response.data);

            // Forzar la actualización del estado
            setFechaSeleccionada(new Date(fechaSeleccionada)); // Esto debería causar una nueva carga de datos
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
            return false; // En caso de error, asumimos que no está reservado.
        }
    };

    useEffect(() => {
        if (disponibilidad.length > 0) {
            disponibilidad.forEach(horario => {
                estaReservado(horario.id);
            });
        }
    }, [fechaSeleccionada, disponibilidad]);

    const minDate = new Date(); // Fecha mínima es hoy

    return (
        <div className="calendar-container">
            <h2>Selecciona un día</h2>
            <Calendar 
                onChange={handleDateChange} 
                value={fechaSeleccionada} 
                minDate={minDate} // Establecer fecha mínima
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

                                return (
                                    <tr
                                        key={horario.id}
                                        style={{
                                            backgroundColor: reservado ? "red" : "transparent",
                                            pointerEvents: reservado ? "none" : "auto"
                                        }}
                                    >
                                        <td>{new Date(horario.comienzo).toLocaleTimeString()}</td>
                                        <td>{new Date(horario.final).toLocaleTimeString()}</td>
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
