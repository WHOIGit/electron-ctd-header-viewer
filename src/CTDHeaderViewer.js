// src/CTDHeaderViewer.js
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import EasyEdit from 'react-easy-edit';
import { parseCTDHeader } from './CTDHeaderParser';
import './styles.css';  // Make sure to import your CSS file

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

  const formatDateForInput = (date) => {
    if (!date) return '';
    // Convert to ISO string and remove the 'Z' and milliseconds
    return date.toISOString().slice(0, -5);
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
                type="datetime-local"
                value={formatDateForInput(parseResult.nmeaTime)}
                onSave={(value) => save(value, 'nmeaTime')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
              />
            </span>
          </p>
          <p>
            <span className="label">System Time (UTC):</span>
            <span className="value">
              <EasyEdit
                type="datetime-local"
                value={formatDateForInput(parseResult.systemTime)}
                onSave={(value) => save(value, 'systemTime')}
                onCancel={cancel}
                saveButtonLabel="Save"
                cancelButtonLabel="Cancel"
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