import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setServiceId(params.get('id')); // Obtén el ID de los parámetros de consulta
  }, [location.search]);

  const newDisponibilidad = async (e) => {
    e.preventDefault(); // Previene el refresco de la página
    let check = validateForm();
    console.log(check);
    if (check)  {
      const Disponibilidades = {
        Dia: 1,
        HoraDesde: fromTime,
        HoraHasta: toTime,
        DuracionTurno: shiftDuration,
        Descanso: timeBetweenShifts
      };
      try {
        console.log(Disponibilidades);
        await axios.post(`http://localhost:5432/Servicio/Disponibilidades/${serviceId}`, Disponibilidades);
        setSelectedDay('Lunes');
        setFromTime('');
        setToTime('');
        setShiftDuration('');
        setTimeBetweenShifts('')
        handleConfirm()
      } catch (error) {
        console.error('Error al agregar service:', error);
      }
    }
  };
  


const validateForm = () => {
  let formErrors = {};

  if (!selectedDay) formErrors.selectedDay = "El Dia es requerido.";
  if (!fromTime)formErrors.fromTime = "El tiempo Desde es requerido.";
  if (!toTime) formErrors.toTime = "El tiempo Hasta es requerido.";
  if (!shiftDuration) formErrors.shiftDuration = "El tiempo de duracion es requerido";
  if (!timeBetweenShifts) formErrors.timeBetweenShifts = "El tiempo entre turnos es requerido";

  setErrors(formErrors);

  return Object.keys(formErrors).length === 0;
};


  const handleConfirm = () => {
    let updatedSchedule = ""
    let existingDayIndex = ""
    if (fromTime && toTime) {
      updatedSchedule = [...schedule];
      existingDayIndex = updatedSchedule.findIndex(item => item.day === selectedDay);
    }
      if (existingDayIndex !== -1) {
        // Si ya existe el día en el schedule, agregamos el nuevo rango de horario
        updatedSchedule[existingDayIndex].ranges.push({ from: fromTime, to: toTime });
        updatedSchedule[existingDayIndex].shiftDuration = shiftDuration;
        updatedSchedule[existingDayIndex].timeBetweenShifts = timeBetweenShifts;
      } else {
        // Si no existe, creamos un nuevo objeto para ese día
        updatedSchedule.push({
          day: selectedDay,
          ranges: [{ from: fromTime, to: toTime }],
          shiftDuration: shiftDuration,
          timeBetweenShifts: timeBetweenShifts
        });
      }
      setSchedule(updatedSchedule);
      setFromTime('');
      setToTime('');
  }
    
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
                  {range.from} - {range.to}
                  {idx !== ranges.length - 1 ? <br /> : ''}
                </span>
              ))}
              <div>
                Duración del turno: {shiftDuration}, Tiempo entre turnos: {timeBetweenShifts}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


export default Horario;
