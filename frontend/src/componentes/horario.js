import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Horario.css';
import axios from 'axios';

const Horario = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [shiftDuration, setShiftDuration] = useState('01:00');
  const [timeBetweenShifts, setTimeBetweenShifts] = useState('00:30');
  const [schedule, setSchedule] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [errors, setErrors] = useState({});
  const [maxShiftDuration, setMaxShiftDuration] = useState('');
  const [maxTimeBetweenShifts, setMaxTimeBetweenShifts] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setServiceId(params.get('id'));
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

  const newDisponibilidad = async (e) => {
    e.preventDefault();
    let check = validateForm();
    if (check) {
      const formattedDuration = formatTimeBasedOnDecimal(shiftDuration);
      const formattedRest = formatTimeBasedOnDecimal(timeBetweenShifts);
  
      const Disponibilidades = {
        Dia: selectedDay,
        HoraDesde: fromTime,
        HoraHasta: toTime,
        DuracionTurno: formattedDuration,
        Descanso: formattedRest,
      };
  
      try {
        await axios.post(`http://localhost:5432/Servicio/Disponibilidades/${serviceId}`, Disponibilidades);
        setSelectedDay('Monday');
        setFromTime('');
        setToTime('');
        setShiftDuration('');
        setTimeBetweenShifts('');
        handleConfirm();
      } catch (error) {
        console.error('Error al agregar service:', error);
      }
    }
  };

  const NextPage = async (e) => {
    e.preventDefault();
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

  const handleFromTimeChange = (e) => {
    setFromTime(e.target.value);
    setToTime('');
    setShiftDuration('');
    setTimeBetweenShifts('');
    setMaxShiftDuration('');
    setMaxTimeBetweenShifts('');
  };

  const handleToTimeChange = (e) => {
    setToTime(e.target.value);
    const fromDate = new Date(`1970-01-01T${fromTime}:00`);
    const toDate = new Date(`1970-01-01T${e.target.value}:00`);
    
    if (fromDate >= toDate) {
      setErrors((prev) => ({ ...prev, toTime: "El tiempo Hasta debe ser mayor que el tiempo Desde." }));
      setMaxShiftDuration('');
      return;
    } else {
      setErrors((prev) => ({ ...prev, toTime: undefined }));
    }

    const diffInHours = (toDate - fromDate) / (1000 * 60 * 60);
    setMaxShiftDuration(diffInHours);
  };

  const handleShiftDurationChange = (e) => {
    setShiftDuration(e.target.value);
    const remainingHours = maxShiftDuration - parseFloat(e.target.value);
    setMaxTimeBetweenShifts(remainingHours);
  };

  const formatTime = (hours) => {
    if (isNaN(hours) || hours < 0) return '01:00';  
    const hourPart = Math.floor(hours);
    const minutePart = Math.round((hours % 1) * 60);
    return `${hourPart.toString().padStart(2, '0')}:${minutePart.toString().padStart(2, '0')}`;
  };

  const formatTimeBasedOnDecimal = (decimalValue) => {
    let totalMinutes = Math.floor(decimalValue * 60); 
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  const handleConfirm = () => {
    if (fromTime && toTime) {
      window.location.reload();
    }
  };
  
  

  return (
    <div className="horario-container">
      <h1>Disponibilidad horaria</h1>
      <p>Seleccionar los horarios en los que ofreces tu servicio</p>
      <div className="time-inputs">
        <div>
          <label>Desde</label>
          <input type="time" value={fromTime} onChange={handleFromTimeChange} />
        </div>
        {errors.fromTime && <p className="error-text">{errors.fromTime}</p>}
        <div>
          <label>Hasta</label>
          <input
            type="time"
            value={toTime}
            onChange={handleToTimeChange}
            disabled={!fromTime}
          />
        </div>
        {errors.toTime && <p className="error-text">{errors.toTime}</p>}
      </div>
      <div className="shift-details">
        <div>
          <label>Duración del turno:</label>
          <select
            value={shiftDuration}
            onChange={handleShiftDurationChange}
            disabled={!toTime}
          >
            {[...Array(Math.floor(maxShiftDuration * 2))].map((_, i) => {
              const hours = (i + 1) / 2;
              return (
                <option key={hours} value={hours.toFixed(2)}>
                  {formatTime(hours)}
                </option>
              );
            })}
          </select>
          {errors.shiftDuration && <p className="error-text">{errors.shiftDuration}</p>}
        </div>
        <div>
          <label>Tiempo entre turnos:</label>
          <select
            value={timeBetweenShifts}
            onChange={(e) => setTimeBetweenShifts(e.target.value)}
            disabled={!shiftDuration}
          >
            {[...Array(Math.floor(maxTimeBetweenShifts * 4))].map((_, i) => {
              const interval = (i + 1) / 4;
              return (
                <option key={interval} value={interval.toFixed(2)}>
                  {formatTime(interval)}
                </option>
              );
            })}
          </select>
          {errors.timeBetweenShifts && <p className="error-text">{errors.timeBetweenShifts}</p>}
        </div>
      </div>
      <div className="day-selector">
        <label>Día:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <button onClick={newDisponibilidad}>Confirmar</button>
      <div className="schedule-list">
      <h2>Horarios seleccionados:</h2>
      {Array.isArray(schedule) && schedule.length > 0 ? (
        schedule.map((item, index) => (
          <div key={index}>
            <h3>{item.Dia}</h3>
            <p>Desde: {item.HoraDesde.split('T')[1].substring(0, 5)}</p>
            <p>Hasta: {item.HoraHasta.split('T')[1].substring(0, 5)}</p>
            <p>Duración del turno: {item.DuracionTurno.split('T')[1].substring(0, 5)}</p>
            <p>Descanso: {item.Descanso.split('T')[1].substring(0, 5)}</p>
          </div>
        ))
      ) : (
        <p>No hay horarios seleccionados.</p>
      )}
    </div>
    <button onClick={NextPage}>Finalizar</button>
  </div>
);
};

export default Horario;

              