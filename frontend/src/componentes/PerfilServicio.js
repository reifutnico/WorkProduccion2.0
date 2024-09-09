import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../css/PerfilServicio.css'; // Asegúrate de importar el CSS
import { useParams } from 'react-router-dom'; // Importa useParams

// Mapeo de días de la semana en inglés
const diasDeLaSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Hook personalizado para obtener disponibilidad
const useDisponibilidad = (idServicio) => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {
                const response = await axios.get(`http://localhost:5432/Disponibilidad/${idServicio}`);
                setDisponibilidad(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (idServicio) {
            obtenerHorarios();
        }
    }, [idServicio]);

    return { disponibilidad, loading, error };
};

// Componente del calendario con disponibilidad
const PerfilServicio = () => {
    const { idServicio } = useParams(); // Obtén idServicio de los parámetros de la URL
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [mostrarDisponibilidad, setMostrarDisponibilidad] = useState(false);

    const { disponibilidad, loading, error } = useDisponibilidad(idServicio);

    // Función para manejar la selección de la fecha
    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
        setMostrarDisponibilidad(true);
    };

    // Obtener el día de la semana de la fecha seleccionada
    const diaSeleccionado = diasDeLaSemana[fechaSeleccionada.getDay()];

    // Filtrar disponibilidad por el día seleccionado
    const horariosFiltrados = disponibilidad.filter(
        (horario) => horario.Dia === diaSeleccionado
    );

    return (
        <div className="calendar-container">
            <h2>Selecciona un día</h2>
            <Calendar onChange={handleDateChange} value={fechaSeleccionada} />
            
            {mostrarDisponibilidad && (
                <div>
                    <h3>Disponibilidad para el {fechaSeleccionada.toDateString()}</h3>
                    {loading ? (
                        <p>Cargando horarios...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : horariosFiltrados.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Hora Desde</th>
                                    <th>Hora Hasta</th>
                                    <th>Duración del Turno</th>
                                    <th>Descanso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horariosFiltrados.map((horario) => (
                                    <tr key={horario.id}>
                                        <td>{new Date(horario.HoraDesde).toLocaleTimeString()}</td>
                                        <td>{new Date(horario.HoraHasta).toLocaleTimeString()}</td>
                                        <td>{new Date(horario.DuracionTurno).toLocaleTimeString()}</td>
                                        <td>{new Date(horario.Descanso).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay disponibilidad para esta fecha.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PerfilServicio;
