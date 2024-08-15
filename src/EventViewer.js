import React, { useState } from 'react';
import { SingleMarkerMap } from './MapWidget';

const EventSelector = ({ events, onSelect }) => {
    return (
        <div class="event-selector">
            <select onChange={onSelect}>
                <option value="">Select an event...</option>
                {events.map((event, index) => (
                    <option value={index} key={index}>
                        {event.Event} - {event.Instrument} - {event.Action}
                    </option>
                ))}
            </select>
        </div>
    );
}

const EventViewer = ({ event }) => {
    return (
        <div class="metadata">
            <div class="metadata-column">
                <pre>{JSON.stringify(event, null, 2)}</pre>
            </div>
            <div class="map-column">
                <SingleMarkerMap latitude={event.Latitude} longitude={event.Longitude} />
            </div>
        </div>
    );
}

export { EventSelector, EventViewer };