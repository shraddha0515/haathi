import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
const elephantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/11879/11879914.png", 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png", 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}
export default function MapView({ userLocation, elephantLocation, allDetections = [] }) {
  const defaultCenter = [21.34, 82.75];
  const [mapMode, setMapMode] = useState("both"); // "user", "detections", "both"
  
  // Determine what to show on the map based on mode
  const getMapCenter = () => {
    if (mapMode === "user" || mapMode === "both") {
      if (userLocation) return userLocation;
    }
    if (mapMode === "detections" || mapMode === "both") {
      if (elephantLocation) return elephantLocation;
      if (allDetections && allDetections.length > 0) {
        const latest = allDetections[0];
        if (latest.latitude && latest.longitude) {
          return [parseFloat(latest.latitude), parseFloat(latest.longitude)];
        }
      }
    }
    return defaultCenter;
  };

  return (
    <div className="w-full h-[500px] rounded-xl border border-emerald-200 shadow-inner overflow-hidden relative">
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-[1000]">
        <select
          value={mapMode}
          onChange={(e) => setMapMode(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="both">🗺️ Both</option>
          <option value="detections">🐘 Detections Only</option>
          <option value="user">📍 My Location Only</option>
        </select>
      </div>

      <MapContainer
        center={userLocation || defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* User Location Marker */}
        {(mapMode === "user" || mapMode === "both") && userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <b className="text-blue-600">You are here</b>
                <p className="text-xs text-gray-500 m-0">Live Location</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Latest Elephant Detection Marker */}
        {(mapMode === "detections" || mapMode === "both") && elephantLocation && (
          <Marker position={elephantLocation} icon={elephantIcon}>
            <Popup>
              <div className="text-center">
                <b className="text-red-600">🐘 Elephant Detected!</b>
                <p className="text-xs text-gray-500 m-0">Latest Detection</p>
                <p className="text-xs text-gray-400 m-0 mt-1">Stay Away</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* All Detection Markers (if provided) */}
        {(mapMode === "detections" || mapMode === "both") && allDetections && allDetections.map((detection, index) => {
          if (detection.latitude && detection.longitude) {
            const position = [parseFloat(detection.latitude), parseFloat(detection.longitude)];
            // Skip if it's the same as elephantLocation to avoid duplicate markers
            if (elephantLocation && 
                Math.abs(position[0] - elephantLocation[0]) < 0.0001 && 
                Math.abs(position[1] - elephantLocation[1]) < 0.0001) {
              return null;
            }
            return (
              <Marker key={`detection-${detection.id || index}`} position={position} icon={elephantIcon}>
                <Popup>
                  <div className="text-center">
                    <b className="text-red-600">🐘 Elephant Detected</b>
                    <p className="text-xs text-gray-600 m-0 mt-1">
                      Device: {detection.source_device || detection.device_id || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 m-0 mt-1">
                      {new Date(detection.detected_at || detection.created_at).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
        <MapUpdater center={getMapCenter()} />
      </MapContainer>
    </div>
  );
}
