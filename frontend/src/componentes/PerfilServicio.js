import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import '../css/PerfilServicio.css';
import { useParams } from 'react-router-dom';

const diasDeLaSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useDisponibilidad = (id, dia) => {
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {
                console.log(id);
                console.log(`Fetching availability for id: ${id} and day: ${dia}`);
                const response = await axios.get(`http://localhost:5432/Servicio/Turnos/${id}?Dia=${dia}`);
                console.log("Horarios obtenidos:", response.data);
                setDisponibilidad(response.data.data || []);
             } catch (err) {
                    console.log("Error al obtener horarios:", err.response ? err.response.data : err.message);
                    setError(err.response ? err.response.data.message : err.message);
                }
            finally { 
                setLoading(false);
            }
        };
        if (id && dia) {
            obtenerHorarios();
        }
    }, [id, dia]);

    return { disponibilidad, loading, error };
};

const PerfilServicio = () => {
    const { id } = useParams();
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    const diaSeleccionado = diasDeLaSemana[fechaSeleccionada.getDay()];
    const { disponibilidad, loading, error } = useDisponibilidad(id, diaSeleccionado);

    const handleDateChange = (date) => {
        console.log("Fecha seleccionada:", date);
        setFechaSeleccionada(date);
    };

    const horariosFiltrados = disponibilidad || [];
    return (
        <div className="calendar-container">
            <h2>Selecciona un día</h2>
            <Calendar onChange={handleDateChange} value={fechaSeleccionada} />
            
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
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horariosFiltrados.map((horario) => (
                                <tr key={horario.comienzo}>
                                    <td>{new Date(horario.comienzo).toLocaleTimeString()}</td>
                                    <td>{new Date(horario.final).toLocaleTimeString()}</td>
                                    <td>{horario.estado ? "Disponible" : "No disponible"}</td>
                                </tr>
                            ))}
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
