import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseEventLog } from './EventLogParser';
import { EventSelector, EventViewer } from './EventViewer';
import './styles.css';  // Make sure to import your CSS file

const EventLogViewer = () => {
  const [parseResult, setParseResult] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        parseEventLog(content).then(result => {
          setParseResult(result);
        });
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatCoordinate = (value) => {
    return value ? value.toFixed(4) : '';
  };

  return (
    <div>
      { !parseResult && (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Event Log CSV here ...</p>
        ) : (
          <p>Drag and drop an Event Log CSV here, or click to select a file</p>
        )}
      </div>
      )}
      { parseResult && (
        <div>
          <EventSelector events={parseResult} onSelect={(e) => {
            const eventData = parseResult[e.target.value];
            setSelectedEvent(eventData);
          }} />
        </div>
      )}
      { selectedEvent && (
        <EventViewer event={selectedEvent} />
      )}
    </div>
  );
};

export default EventLogViewer;