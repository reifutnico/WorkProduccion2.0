import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';

// Hook personalizado para obtener disponibilidad
const useDisponibilidad = (idServicio) => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {
                const response = await axios.get(`/disponibilidad/${idServicio}`);
                setDisponibilidad(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerHorarios();
    }, [idServicio]);

    return { disponibilidad, loading, error };
};

// Componente del calendario con disponibilidad
const PerfilServicio = ({ idServicio }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [mostrarDisponibilidad, setMostrarDisponibilidad] = useState(false);

    const { disponibilidad, loading, error } = useDisponibilidad(idServicio);

    // Función para manejar la selección de la fecha
    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
        setMostrarDisponibilidad(true);
    };

    // Filtrar disponibilidad por el día seleccionado
    const horariosFiltrados = disponibilidad.filter(
        (horario) => {
            const diaBD = new Date(horario.Dia); // Convertir el día de la BD a un objeto Date
            return diaBD.toDateString() === fechaSeleccionada.toDateString(); // Comparar fechas
        }
    );

    return (
        <div>
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
                                        <td>{horario.HoraDesde}</td>
                                        <td>{horario.HoraHasta}</td>
                                        <td>{horario.DuracionTurno} minutos</td>
                                        <td>{horario.Descanso} minutos</td>
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
