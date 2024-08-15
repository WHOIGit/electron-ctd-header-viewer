import React, { useState } from 'react';
import './styles.css';  // Make sure to import your CSS file

const Custom24HourTimeInput = ({ value, onChange }) => {
  const [date, setDate] = useState(value.toISOString().split('T')[0]);
  const [hours, setHours] = useState(value.getUTCHours().toString().padStart(2, '0'));
  const [minutes, setMinutes] = useState(value.getUTCMinutes().toString().padStart(2, '0'));
  const [seconds, setSeconds] = useState(value.getUTCSeconds().toString().padStart(2, '0'));

  const handleChange = (newDate, newHours, newMinutes, newSeconds) => {
    const updatedDate = new Date(`${newDate}T${newHours.padStart(2, '0')}:${newMinutes.padStart(2, '0')}:${newSeconds.padStart(2, '0')}Z`);
    onChange(updatedDate);
  };

  const handleTimeInputChange = (value, setter, max) => {
    let newValue = value.replace(/\D/g, '').slice(0, 2);
    if (newValue === '' || parseInt(newValue) > max) {
      newValue = '00';
    }
    setter(newValue.padStart(2, '0'));
    return newValue;
  };

  return (
    <div className="custom-time-input">
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          handleChange(e.target.value, hours, minutes, seconds);
        }}
      />
      <div className="time-group">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="23"
          value={hours}
          onChange={(e) => {
            const newHours = handleTimeInputChange(e.target.value, setHours, 23);
            handleChange(date, newHours, minutes, seconds);
          }}
        />
      </div>
      <span className="time-separator">:</span>
      <div className="time-group">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => {
            const newMinutes = handleTimeInputChange(e.target.value, setMinutes, 59);
            handleChange(date, hours, newMinutes, seconds);
          }}
        />
      </div>
      <span className="time-separator">:</span>
      <div className="time-group">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => {
            const newSeconds = handleTimeInputChange(e.target.value, setSeconds, 59);
            handleChange(date, hours, minutes, newSeconds);
          }}
        />
      </div>
    </div>
  );
};

export default Custom24HourTimeInput;