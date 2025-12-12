import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const deviceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const elephantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/11879/11879914.png", 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png", 
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function AdminMapView({ devices, detections = [], userLocation = null, focusedEvent = null }) {
  const defaultCenter = [21.34, 82.75];
  const [mapMode, setMapMode] = useState("both"); // "detections", "devices", "both"
  
  
  // Calculate center and zoom based on focused event or default behavior
  const getMapCenter = () => {
    // If there's a focused event, center on it
    if (focusedEvent && focusedEvent.latitude && focusedEvent.longitude) {
      return [parseFloat(focusedEvent.latitude), parseFloat(focusedEvent.longitude)];
    }
    
    if (mapMode === "detections" || mapMode === "both") {
      if (detections && detections.length > 0) {
        const firstDetection = detections.find(d => d.latitude && d.longitude);
        if (firstDetection) {
          return [parseFloat(firstDetection.latitude), parseFloat(firstDetection.longitude)];
        }
      }
    }
    
    if (mapMode === "devices" || mapMode === "both") {
      if (devices && devices.length > 0) {
        const firstDevice = devices.find(d => d.latitude && d.longitude);
        if (firstDevice) {
          return [parseFloat(firstDevice.latitude), parseFloat(firstDevice.longitude)];
        }
      }
    }
    
    return defaultCenter;
  };

  // Calculate distance if both user location and focused event exist
  const distance = (userLocation && focusedEvent && focusedEvent.latitude && focusedEvent.longitude)
    ? calculateDistance(
        userLocation[0], 
        userLocation[1], 
        parseFloat(focusedEvent.latitude), 
        parseFloat(focusedEvent.longitude)
      )
    : null;

  // Prepare polyline coordinates for route
  const routeCoordinates = (userLocation && focusedEvent && focusedEvent.latitude && focusedEvent.longitude)
    ? [
        userLocation,
        [parseFloat(focusedEvent.latitude), parseFloat(focusedEvent.longitude)]
      ]
    : null;

  // Determine zoom level - zoom in more when focusing on an event
  const zoomLevel = focusedEvent ? 12 : 6;

  return (
    <div className="w-full h-[500px] rounded-xl border border-gray-200 shadow-inner overflow-hidden relative">
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-[1000]">
        <select
          value={mapMode}
          onChange={(e) => setMapMode(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="both">🗺️Both</option>
          <option value="detections">🐘 Detections</option>
          <option value="devices">📡 Devices </option>
        </select>
      </div>

      {/* Distance Display */}
      {distance && focusedEvent && (
        <div className="absolute top-4 left-4 z-[1000] bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Distance:</span>
            <span className="text-sm font-bold text-red-600">
              {distance < 1 
                ? `${(distance * 1000).toFixed(0)} meters` 
                : `${distance.toFixed(2)} km`}
            </span>
          </div>
        </div>
      )}

      <MapContainer
        center={getMapCenter()}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Render polyline route between user and focused event */}
        {routeCoordinates && (
          <Polyline 
            positions={routeCoordinates} 
            color="red" 
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Render user location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <b className="text-blue-600">👤 Your Location</b>
                <p className="text-xs text-gray-500 m-0">Current Position</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Render detection markers */}
        {(mapMode === "detections" || mapMode === "both") && detections && detections.map((detection, index) => {
          if (detection.latitude && detection.longitude) {
            const position = [parseFloat(detection.latitude), parseFloat(detection.longitude)];
            const isFocused = focusedEvent && focusedEvent.id === detection.id;
            return (
              <Marker key={`detection-${detection.id || index}`} position={position} icon={elephantIcon}>
                <Popup autoOpen={isFocused}>
                  <div className="text-center">
                    <b className="text-red-600">🐘 Elephant Detected!</b>
                    <p className="text-xs text-gray-600 m-0 mt-1">
                      Device: {detection.source_device || detection.device_id || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 m-0 mt-1">
                      {new Date(detection.detected_at || detection.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 m-0 mt-1">
                      Lat: {parseFloat(detection.latitude).toFixed(4)}, Lng: {parseFloat(detection.longitude).toFixed(4)}
                    </p>
                    {isFocused && distance && (
                      <p className="text-xs font-bold text-red-600 m-0 mt-2">
                        📏 {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(2)}km`} from you
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
       
        {(mapMode === "devices" || mapMode === "both") && devices && devices.map((device) => {
          if (device.latitude && device.longitude) {
            const position = [parseFloat(device.latitude), parseFloat(device.longitude)];
            return (
              <Marker key={`device-${device.id}`} position={position} icon={deviceIcon}>
                <Popup>
                  <div className="text-center">
                    <b className="text-blue-600">📡 {device.device_id}</b>
                    <p className="text-xs text-gray-600 m-0 mt-1">{device.description || 'No description'}</p>
                    <p className="text-xs text-gray-400 m-0 mt-1">
                      Status: <span className={device.status === 'online' ? 'text-green-600' : 'text-gray-500'}>
                        {device.status || 'Unknown'}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
        <MapUpdater center={getMapCenter()} zoom={zoomLevel} />
      </MapContainer>
    </div>
  );
}
