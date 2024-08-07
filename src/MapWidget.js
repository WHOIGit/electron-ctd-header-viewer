import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [12, 20],  // Reduced from [25, 41]
    iconAnchor: [6, 20], // Adjusted to half the width and full height
    popupAnchor: [1, -17], // Adjusted to half the previous value
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [20, 20]  // Reduced from [41, 41]
  });

const MapWidget = ({ latitude, longitude }) => {
  const position = [latitude, longitude];

  return (
    <div className="map-widget">
      <MapContainer center={position} zoom={5} style={{ height: '200px', width: '100%' }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
          maxZoom={13}
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Latitude: {latitude.toFixed(4)}<br />
            Longitude: {longitude.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWidget;