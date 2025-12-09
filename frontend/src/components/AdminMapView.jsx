import React, { useEffect } from "react";
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

const deviceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
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

export default function AdminMapView({ devices }) {
  const defaultCenter = [21.34, 82.75]; // Default center of India
  
  // Calculate center based on devices
  const getMapCenter = () => {
    if (!devices || devices.length === 0) return defaultCenter;
    
    const firstDevice = devices.find(d => d.latitude && d.longitude);
    if (firstDevice) {
      return [parseFloat(firstDevice.latitude), parseFloat(firstDevice.longitude)];
    }
    return defaultCenter;
  };

  return (
    <div className="w-full h-[500px] rounded-xl border border-gray-200 shadow-inner overflow-hidden relative z-0">
      <MapContainer
        center={getMapCenter()}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Render all devices */}
        {devices && devices.map((device) => {
          if (device.latitude && device.longitude) {
            const position = [parseFloat(device.latitude), parseFloat(device.longitude)];
            return (
              <Marker key={device.id} position={position} icon={deviceIcon}>
                <Popup>
                  <div className="text-center">
                    <b className="text-blue-600">{device.device_id}</b>
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
        
        <MapUpdater center={getMapCenter()} />
      </MapContainer>
    </div>
  );
}
