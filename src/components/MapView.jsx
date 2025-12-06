import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issues in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom Icons
const elephantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/375/375048.png", // Elephant icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png", // Person icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to center map on updates
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapView({ userLocation, elephantLocation }) {
  const defaultCenter = [21.34, 82.75]; // Default fallback

  return (
    <div className="w-full h-[500px] rounded-xl border border-emerald-200 shadow-inner overflow-hidden relative z-0">
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* User Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <b className="text-blue-600">You are here</b>
                <p className="text-xs text-gray-500 m-0">Live Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Elephant Marker */}
        {elephantLocation && (
          <Marker position={elephantLocation} icon={elephantIcon}>
            <Popup>
              <div className="text-center">
                <b className="text-red-600">Elephant Detected!</b>
                <p className="text-xs text-gray-500 m-0">Stay Away</p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapUpdater center={userLocation || elephantLocation || defaultCenter} />
      </MapContainer>
    </div>
  );
}
