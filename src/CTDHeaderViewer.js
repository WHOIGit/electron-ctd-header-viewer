// src/CTDHeaderViewer.js
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import EasyEdit from 'react-easy-edit';
import { parseCTDHeader } from './CTDHeaderParser';
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

const CTDHeaderViewer = () => {
  const [parseResult, setParseResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const result = parseCTDHeader(content);
        setParseResult(result);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const save = (value, field) => {
    if (field === 'nmeaTime' || field === 'systemTime') {
      // Ensure the input is treated as UTC
      value = new Date(value + 'Z');
    } else if (field === 'latitude' || field === 'longitude') {
      // Round to 4 decimal places
      value = Number(parseFloat(value).toFixed(4));
    }
    setParseResult(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cancel = () => {
    // Do nothing on cancel
  };

  const formatCoordinate = (value) => {
    return value ? value.toFixed(4) : '';
  };

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CTD header file here...</p>
        ) : (
          <p>Drag and drop a CTD header file here, or click to select a file</p>
        )}
      </div>
      {parseResult && (
        <div className="parsed-results">
          <h2>Parsed Results:</h2>
          <p>
            <span className="label">NMEA Time (UTC):</span>
            <span className="value">
              <EasyEdit
                type="custom"
                onSave={(value) => save(value, 'nmeaTime')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
                editComponent={<Custom24HourTimeInput />}
                value={parseResult.nmeaTime}
                displayComponent={<span>{parseResult.nmeaTime.toISOString()}</span>}
              />
            </span>
          </p>
          <p>
            <span className="label">System Time (UTC):</span>
            <span className="value">
              <EasyEdit
                type="custom"
                onSave={(value) => save(value, 'systemTime')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
                editComponent={<Custom24HourTimeInput />}
                value={parseResult.systemTime}
                displayComponent={<span>{parseResult.systemTime.toISOString()}</span>}
              />
            </span>
          </p>
          <p>
            <span className="label">Latitude:</span>
            <span className="value">
              <EasyEdit
                type="number"
                value={formatCoordinate(parseResult.latitude)}
                onSave={(value) => save(value, 'latitude')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
              />
            </span>
          </p>
          <p>
            <span className="label">Longitude:</span>
            <span className="value">
              <EasyEdit
                type="number"
                value={formatCoordinate(parseResult.longitude)}
                onSave={(value) => save(value, 'longitude')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
              />
            </span>
          </p>
          <p>
            <span className="label">Variables:</span>
            <span className="value">{parseResult.variables.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CTDHeaderViewer;