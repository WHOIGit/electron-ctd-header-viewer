import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCTDHeader } from './CTDHeaderParser';

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
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CTD header file here...</p>
        ) : (
          <p>Drag and drop a CTD header file here, or click to select a file</p>
        )}
      </div>
      {parseResult && (
        <div>
          <h2>Parsed Results:</h2>
          <p>NMEA Time: {parseResult.nmeaTime?.toLocaleString()}</p>
          <p>System Time: {parseResult.systemTime?.toLocaleString()}</p>
          <p>Latitude: {parseResult.latitude?.toFixed(6)}</p>
          <p>Longitude: {parseResult.longitude?.toFixed(6)}</p>
          <p>Variables: {parseResult.variables.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default CTDHeaderViewer;