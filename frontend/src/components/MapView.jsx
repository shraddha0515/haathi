import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";


export default function MapView() {
  const [elephants, setElephants] = useState([]);
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/elephants")
      .then(res => setElephants(res.data));

    const interval = setInterval(() => {
      axios.get("http://localhost:5000/api/sensors/latest")
        .then(res => setSensorData(res.data));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[21.3, 82.7]}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {elephants.map((e) => (
        <Marker key={e.id} position={[e.location[0], e.location[1]]}>
          <Popup>
            <b>{e.name}</b> <br />
            Status: {e.status}
          </Popup>
        </Marker>
      ))}

      {sensorData && (
        <Marker position={[21.5, 82.9]}>
          <Popup>
            <b>Live Sensor Data</b><br />
            {JSON.stringify(sensorData)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
