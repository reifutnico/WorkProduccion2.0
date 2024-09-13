import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Horario.css';
import axios from 'axios';

const Horario = () => {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [shiftDuration, setShiftDuration] = useState('');
  const [timeBetweenShifts, setTimeBetweenShifts] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setServiceId(params.get('id')); // Obtén el ID de los parámetros de consulta
  }, [location.search]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (serviceId) {
        try {
          const response = await axios.get(`http://localhost:5432/Disponibilidad/${serviceId}`);
          setSchedule(response.data);
        } catch (error) {
          console.error('Error al obtener disponibilidad:', error);
        }
      }
    };

    fetchSchedule();
  }, [serviceId]);

  // Función para calcular los turnos disponibles
  const calcularTurnos = (desde, hasta, duracion, descanso) => {
    const turnos = [];
    const desdeHora = new Date(`1970-01-01T${desde}:00Z`);
    const hastaHora = new Date(`1970-01-01T${hasta}:00Z`);
    const duracionTurno = new Date(`1970-01-01T${duracion}:00Z`);
    const tiempoDescanso = new Date(`1970-01-01T${descanso}:00Z`);

    let horaActual = new Date(desdeHora);

    while (horaActual < hastaHora) {
      const horaFinTurno = new Date(horaActual.getTime() + duracionTurno.getTime());

      if (horaFinTurno <= hastaHora) {
        turnos.push({
          HoraDesde: horaActual.toISOString(),
          HoraHasta: horaFinTurno.toISOString(),
          DuracionTurno: duracion,
          Descanso: descanso
        });
        horaActual = new Date(horaFinTurno.getTime() + tiempoDescanso.getTime());
      } else {
        break;
      }
    }

    return turnos;
  };

  const handleConfirm = () => {
    let updatedSchedule = [...schedule];
    let existingDayIndex = updatedSchedule.findIndex(item => item.day === selectedDay);

    if (fromTime && toTime && shiftDuration && timeBetweenShifts) {
      const turnosCalculados = calcularTurnos(fromTime, toTime, shiftDuration, timeBetweenShifts);

      if (existingDayIndex !== -1) {
        // Si ya existe el día en el schedule, reemplaza los turnos
        updatedSchedule[existingDayIndex].ranges = turnosCalculados;
        updatedSchedule[existingDayIndex].shiftDuration = shiftDuration;
        updatedSchedule[existingDayIndex].timeBetweenShifts = timeBetweenShifts;
      } else {
        // Si no existe, crea un nuevo objeto para ese día
        updatedSchedule.push({
          day: selectedDay,
          ranges: turnosCalculados,
          shiftDuration: shiftDuration,
          timeBetweenShifts: timeBetweenShifts
        });
      }
      
      setSchedule(updatedSchedule);
      setFromTime('');
      setToTime('');
    }
  };

  const newDisponibilidad = async (e) => {
    e.preventDefault();
    let check = validateForm();
    if (check) {
      try {
        console.log("Enviando disponibilidad...");
        await axios.post(`http://localhost:5432/Servicio/Disponibilidades/${serviceId}`, schedule);
        setSelectedDay('Lunes');
        setFromTime('');
        setToTime('');
        setShiftDuration('');
        setTimeBetweenShifts('');
        handleConfirm();
      } catch (error) {
        console.error('Error al agregar disponibilidad:', error);
      }
    }
  };

  const NextPage = async (e) => {
    e.preventDefault(); // Previene el refresco de la página
    navigate(`/`);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!selectedDay) formErrors.selectedDay = "El Dia es requerido.";
    if (!fromTime) formErrors.fromTime = "El tiempo Desde es requerido.";
    if (!toTime) formErrors.toTime = "El tiempo Hasta es requerido.";
    if (!shiftDuration) formErrors.shiftDuration = "El tiempo de duracion es requerido";
    if (!timeBetweenShifts) formErrors.timeBetweenShifts = "El tiempo entre turnos es requerido";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  return (
    <div className="horario-container">
      <h1>Disponibilidad horaria</h1>
      <p>Seleccionar los horarios en los que ofreces tu servicio</p>
      <div className="time-inputs">
        <div className="dropdown">
          <button className="dropbtn">{selectedDay}</button>
          <div className="dropdown-content">
            {daysOfWeek.map(day => (
              <button key={day} onClick={() => setSelectedDay(day)}>
                {day}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label>Desde</label>
          <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
        </div>
        {errors.fromTime && <p className="error-text">{errors.fromTime}</p>}
        <div>
          <label>Hasta</label>
          <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
        </div>
        {errors.toTime && <p className="error-text">{errors.toTime}</p>}
      </div>
      <div className="shift-details">
        <div>
          <label>Duración del turno:</label>
          <input
            type="time"
            value={shiftDuration}
            onChange={(e) => setShiftDuration(e.target.value)}
          />
          {errors.shiftDuration && <p className="error-text">{errors.shiftDuration}</p>}
        </div>
        <div>
          <label>Tiempo entre turnos:</label>
          <input
            type="time"
            value={timeBetweenShifts}
            onChange={(e) => setTimeBetweenShifts(e.target.value)}
          />
          {errors.timeBetweenShifts && <p className="error-text">{errors.timeBetweenShifts}</p>}
        </div>
      </div>
      <button onClick={newDisponibilidad}>Confirmar</button>
      <div className="schedule-summary">
        <h2>Resumen de horarios confirmados</h2>
        <ul>
          {schedule.map(({ day, ranges, shiftDuration, timeBetweenShifts }, index) => (
            <li key={index}>
              <strong>{day}:</strong>
              {ranges.map((range, idx) => (
                <span key={idx}>
                  {new Date(range.HoraDesde).toLocaleTimeString()} - {new Date(range.HoraHasta).toLocaleTimeString()}
                  {idx !== ranges.length - 1 ? <br /> : ''}
                </span>
              ))}
              <div>
                Duración del turno: {shiftDuration}, Tiempo entre turnos: {timeBetweenShifts}
              </div>
            </li>
          ))}
        </ul>
        {schedule.length > 0 && <button onClick={NextPage}>Avanzar</button>}
      </div>
    </div>
  );
}

export default Horario;
