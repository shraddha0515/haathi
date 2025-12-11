import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { X } from "lucide-react";
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

const deviceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export default function MapModal({ isOpen, onClose, eventData, deviceLocation }) {
  const [mapKey, setMapKey] = useState(0);

  if (!isOpen) return null;

  // Default center (India)
  const defaultCenter = [21.34, 82.75];
  
  // Event location (elephant detection)
  const eventLocation = eventData?.latitude && eventData?.longitude
    ? [parseFloat(eventData.latitude), parseFloat(eventData.longitude)]
    : null;

  // Device location
  const devicePos = deviceLocation?.latitude && deviceLocation?.longitude
    ? [parseFloat(deviceLocation.latitude), parseFloat(deviceLocation.longitude)]
    : null;

  // Determine map center - prefer event location, fallback to device, then default
  const mapCenter = eventLocation || devicePos || defaultCenter;

  // Calculate zoom level based on markers
  const getZoomLevel = () => {
    if (eventLocation && devicePos) {
      // If both markers exist, calculate distance and adjust zoom
      const lat1 = eventLocation[0];
      const lon1 = eventLocation[1];
      const lat2 = devicePos[0];
      const lon2 = devicePos[1];
      
      const distance = Math.sqrt(
        Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)
      );
      
      // Adjust zoom based on distance
      if (distance < 0.01) return 15;
      if (distance < 0.05) return 13;
      if (distance < 0.1) return 12;
      return 11;
    }
    return 14;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-red-50 to-orange-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🐘 Elephant Detection Alert
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Device: <span className="font-semibold">{eventData?.source_device || eventData?.device_id || 'Unknown'}</span>
              {eventData?.detected_at && (
                <span className="ml-3 text-gray-500">
                  {new Date(eventData.detected_at).toLocaleString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0">
            <MapContainer
              key={mapKey}
              center={mapCenter}
              zoom={getZoomLevel()}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              scrollWheelZoom={true}
            >
              <LayersControl position="topright">
                {/* Street Map */}
                <LayersControl.BaseLayer checked name="🗺️ Street Map">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </LayersControl.BaseLayer>

                {/* Satellite View */}
                <LayersControl.BaseLayer name="🛰️ Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  />
                </LayersControl.BaseLayer>

                {/* Terrain View */}
                <LayersControl.BaseLayer name="🏔️ Terrain">
                  <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
                  />
                </LayersControl.BaseLayer>

                {/* Hybrid View (Satellite + Labels) */}
                <LayersControl.BaseLayer name="🌍 Hybrid">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {/* Device Location Marker */}
              {devicePos && (
                <Marker position={devicePos} icon={deviceIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <b className="text-blue-600 text-base">📡 Detection Device</b>
                      <p className="text-sm text-gray-700 m-0 mt-2 font-semibold">
                        {eventData?.source_device || eventData?.device_id || 'Unknown Device'}
                      </p>
                      <p className="text-xs text-gray-500 m-0 mt-1">
                        📍 {devicePos[0].toFixed(4)}, {devicePos[1].toFixed(4)}
                      </p>
                      {deviceLocation?.description && (
                        <p className="text-xs text-gray-600 m-0 mt-1 italic">
                          {deviceLocation.description}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Elephant Detection Marker */}
              {eventLocation && (
                <Marker position={eventLocation} icon={elephantIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <b className="text-red-600 text-base">🐘 Elephant Detected!</b>
                      <p className="text-sm text-gray-700 m-0 mt-2 font-semibold">
                        Detection Point
                      </p>
                      <p className="text-xs text-gray-500 m-0 mt-1">
                        📍 {eventLocation[0].toFixed(4)}, {eventLocation[1].toFixed(4)}
                      </p>
                      {eventData?.detected_at && (
                        <p className="text-xs text-gray-400 m-0 mt-1">
                          🕒 {new Date(eventData.detected_at).toLocaleString()}
                        </p>
                      )}
                      {devicePos && eventLocation && (
                        <p className="text-xs text-orange-600 m-0 mt-2 font-semibold">
                          ⚠️ Stay Alert!
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-700 font-medium">Device Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-700 font-medium">Elephant Detection</span>
            </div>
            {eventLocation && devicePos && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs text-gray-500 italic">
                  💡 Use layer control (top-right) to switch map views
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
