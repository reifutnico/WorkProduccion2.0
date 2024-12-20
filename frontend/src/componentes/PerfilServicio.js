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
                        axios.get(`http://localhost:5000/Servicio/Turnos/${id}?Dia=${dia}`),
                        axios.get(`http://localhost:5000/Servicio/TurnosReservados/${id}?Fecha=${fechaSeleccionada.toISOString().split('T')[0]}`)
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
        const [diasDisponibles, setDiasDisponibles] = useState([]);
        const diaSeleccionado = diasDeLaSemana[fechaSeleccionada.getDay()];
        const { disponibilidad, reservas, setDisponibilidad } = useDisponibilidad(id, diaSeleccionado, fechaSeleccionada);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        console.log("ID extraída de la URL:", id);

        const handleDateChange = (date) => {
            setFechaSeleccionada(date);
        };

        useEffect(() => {
            const obtenerDiasDisponibles = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:5000/Disponibilidad/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
    
                    const data = response.data;
                    const dias = data.map((item) => {
                        const diaIndex = diasDeLaSemana.indexOf(item.Dia);
                        return { diaIndex, ...item };
                    });
    
                    setDiasDisponibles(dias);
                } catch (err) {
                    setError(err.response ? err.response.data.message : err.message);
                } finally {
                    setLoading(false);
                }
            };
    
            if (id) obtenerDiasDisponibles();
        }, [id, token]);

        const reservarTurno = async (idTurno) => {
            const fechaReserva = fechaSeleccionada.toISOString().split('T')[0]; 
            console.log(`Intentando reservar el turno con ID: ${idTurno} para la fecha: ${fechaReserva}`);
            
            try {
                console.log(token);
                const response = await axios.post(
                    `http://localhost:5000/Servicio/Turnos/${idTurno}/reservar`, 
                    { fechaReserva, id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("Reserva creada exitosamente:", response.data);
                setFechaSeleccionada(new Date(fechaSeleccionada));
            } catch (err) {
                alert(`Error al reservar el turno con ID: ${idTurno}\n${err.response ? err.response.data.error : err.message}`);
            }
        };
        
        const estaReservado = async (idTurno) => {
            const fechaSeleccionadaStr = fechaSeleccionada.toISOString().split('T')[0];
            console.log("Chequeando reserva para ID:", idTurno);
            console.log("Fecha seleccionada:", fechaSeleccionadaStr);

            try {
                const response = await axios.get(`http://localhost:5000/Servicio/TurnosReservados/${idTurno}?Fecha=${fechaSeleccionadaStr}`);
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

        const tileClassName = ({ date, view }) => {
            if (view === "month") {
                const diaIndex = date.getDay();
                const isAvailable = diasDisponibles.some((dia) => dia.diaIndex === diaIndex);
                return isAvailable ? "dia-disponible" : null;
            }
            return null;
        };

        const minDate = new Date(); 

        return (
            <div className="calendar-container">
                <h2>Selecciona un día</h2>
                <Calendar 
                    onChange={handleDateChange} 
                    value={fechaSeleccionada} 
                    minDate={minDate}
                    tileClassName={tileClassName} 
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
                                                    <button className="reservado" onClick={() => reservarTurno(horario.id)}>
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
