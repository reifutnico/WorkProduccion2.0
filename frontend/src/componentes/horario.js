import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Horario.css';
import axios from 'axios';

const Horario = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [shiftDuration, setShiftDuration] = useState('');
  const [timeBetweenShifts, setTimeBetweenShifts] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [errors, setErrors] = useState({});
  const [maxShiftDuration, setMaxShiftDuration] = useState('');
  const [maxTimeBetweenShifts, setMaxTimeBetweenShifts] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de días en inglés
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const parseTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };
  

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
    console.log(check);
    if (check) {
      const durationDecimal = parseTime(shiftDuration);
      const restDecimal = parseTime(timeBetweenShifts);
      const formattedDuration = formatTime(durationDecimal);
      const formattedRest = formatTime(restDecimal);
  
      const Disponibilidades = {
        Dia: selectedDay,
        HoraDesde: fromTime,
        HoraHasta: toTime,
        DuracionTurno: formattedDuration,
        Descanso: formattedRest,
      };
  
      try {
        console.log(Disponibilidades);
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

  const handleFromTimeChange = (e) => {
    setFromTime(e.target.value);
    setToTime(''); // Resetear el campo "Hasta"
    setShiftDuration('');
    setTimeBetweenShifts('');
    setMaxShiftDuration('');
    setMaxTimeBetweenShifts('');
  };

  const handleToTimeChange = (e) => {
    setToTime(e.target.value);
    const fromDate = new Date(`1970-01-01T${fromTime}:00`);
    const toDate = new Date(`1970-01-01T${e.target.value}:00`);
    
    // Validación para asegurarse de que "Desde" sea menor que "Hasta"
    if (fromDate >= toDate) {
      setErrors((prev) => ({ ...prev, toTime: "El tiempo Hasta debe ser mayor que el tiempo Desde." }));
      setMaxShiftDuration('');
      return;
    } else {
      setErrors((prev) => ({ ...prev, toTime: undefined })); // Limpiar el error si es válido
    }

    const diffInHours = (toDate - fromDate) / (1000 * 60 * 60);
    setMaxShiftDuration(diffInHours);
  };

  const handleShiftDurationChange = (e) => {
    setShiftDuration(e.target.value);
    const remainingHours = maxShiftDuration - parseFloat(e.target.value);
    setMaxTimeBetweenShifts(remainingHours); // Limitar el tiempo entre turnos
  };

  const formatTime = (hours) => {
    if (isNaN(hours) || hours < 0) return '00:00'; // Maneja caso NaN o negativo
    const hourPart = Math.floor(hours);
    const minutePart = Math.round((hours % 1) * 60); // Redondea los minutos
    return `${hourPart.toString().padStart(2, '0')}:${minutePart.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    let updatedSchedule = [...schedule];
    let existingDayIndex = updatedSchedule.findIndex(item => item.day === selectedDay);
  
    if (fromTime && toTime) {
      const fromHour = parseTime(fromTime);
      const toHour = parseTime(toTime);
      const durationHours = toHour - fromHour;
  
      if (durationHours <= 0) {
        alert('La duración debe ser positiva y realista.'); // Error si la duración es negativa o cero
        return;
      }
  
      const formattedDuration = formatTime(durationHours); // Formatear duración
      const maxRest = durationHours; // El tiempo máximo de descanso es igual a la duración
      const formattedRest = formatTime(maxRest); // Formatear descanso
  
      if (existingDayIndex !== -1) {
        // Si ya existe el día en el schedule, agregamos el nuevo rango de horario
        updatedSchedule[existingDayIndex].ranges.push({ from: fromTime, to: toTime });
        updatedSchedule[existingDayIndex].shiftDuration = formattedDuration; // Usar el valor formateado
        updatedSchedule[existingDayIndex].timeBetweenShifts = formattedRest; // Usar el valor formateado
      } else {
        // Si no existe, creamos un nuevo objeto para ese día
        updatedSchedule.push({
          day: selectedDay,
          ranges: [{ from: fromTime, to: toTime }],
          shiftDuration: formattedDuration, // Usar el valor formateado
          timeBetweenShifts: formattedRest, // Usar el valor formateado
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

      {/* Selección de horario Desde */}
      <div className="time-inputs">
        <div>
          <label>Desde</label>
          <input type="time" value={fromTime} onChange={handleFromTimeChange} />
        </div>
        {errors.fromTime && <p className="error-text">{errors.fromTime}</p>}

        {/* Selección de horario Hasta (habilitado cuando se selecciona Desde) */}
        <div>
          <label>Hasta</label>
          <input
            type="time"
            value={toTime}
            onChange={handleToTimeChange}
            disabled={!fromTime} // Habilitado solo si se selecciona "Desde"
          />
        </div>
        {errors.toTime && <p className="error-text">{errors.toTime}</p>}
      </div>

      {/* Selección de duración del turno (habilitado después de seleccionar "Hasta") */}
      <div className="shift-details">
        <div>
          <label>Duración del turno:</label>
          <select
            value={shiftDuration}
            onChange={handleShiftDurationChange}
            disabled={!toTime} // Habilitado solo si se selecciona "Hasta"
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

        {/* Selección del descanso (habilitado después de seleccionar "Duración del turno") */}
        <div>
          <label>Tiempo entre turnos:</label>
          <select
            value={timeBetweenShifts}
            onChange={(e) => setTimeBetweenShifts(e.target.value)}
            disabled={!shiftDuration} // Habilitado solo si se selecciona "Duración del turno"
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
        {schedule.length > 0 && <button onClick={NextPage}>Avanzar</button>}
      </div>
    </div>
  );
}

export default Horario;
