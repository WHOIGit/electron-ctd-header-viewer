import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [12, 20],
    iconAnchor: [6, 20],
    popupAnchor: [1, -17],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [20, 20]
  });

const SingleMarkerMap = ({ latitude, longitude }) => {
  const position = [latitude, longitude];

  return (
    <div className="map-widget">
      <MapContainer center={position} zoom={5} style={{ height: '200px', width: '100%' }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, IHO-IOC GEBCO, NGS, Esri, DeLorme"
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

const MultiMarkerMap = ({ markers }) => {
  const centerLatitude = markers.reduce((sum, marker) => sum + marker.latitude, 0) / markers.length;
  const centerLongitude = markers.reduce((sum, marker) => sum + marker.longitude, 0) / markers.length;
  return (
    <div className="map-widget">
      <MapContainer center={[centerLatitude, centerLongitude]} zoom={7} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, IHO-IOC GEBCO, NGS, Esri, DeLorme"
          maxZoom={13}
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]} icon={customIcon}>
            <Popup>
              Latitude: {marker.latitude.toFixed(4)}<br />
              Longitude: {marker.longitude.toFixed(4)}
              {marker.description && marker.description.length > 0 && (
                <div>{marker.description}</div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// export both components
export { SingleMarkerMap, MultiMarkerMap };