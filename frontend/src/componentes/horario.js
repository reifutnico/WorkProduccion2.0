import React, { useState } from 'react';
import '../css/Horario.css';

const Horario = () => {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [shiftDuration, setShiftDuration] = useState('');
  const [timeBetweenShifts, setTimeBetweenShifts] = useState('');
  const [schedule, setSchedule] = useState([]);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleConfirm = () => {
    if (fromTime && toTime) {
      const updatedSchedule = [...schedule];
      const existingDayIndex = updatedSchedule.findIndex(item => item.day === selectedDay);

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
  };

  return (
    <div className="horario-container">
      <h1>Disponibilidad horaria</h1>
      <p>Seleccionar los horarios en los que ofreces tu servicio</p>
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
      <div className="time-inputs">
        <div>
          <label>Desde</label>
          <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
        </div>
        <div>
          <label>Hasta</label>
          <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
        </div>
      </div>
      <div className="shift-details">
        <div>
          <label>Duración del turno:</label>
          <input
            type="time"
            value={shiftDuration}
            onChange={(e) => setShiftDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Tiempo entre turnos:</label>
          <input
            type="time"
            value={timeBetweenShifts}
            onChange={(e) => setTimeBetweenShifts(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleConfirm}>Confirmar</button>

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
};

export default Horario;
