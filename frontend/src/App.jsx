import "./App.css";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AlertFeed from "./components/AlertFeed";
import { useState } from "react";

export default function App() {
  const [alerts, setAlerts] = useState([]);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <MapView setAlerts={setAlerts} />
        <AlertFeed alerts={alerts} />
      </div>
    </div>
  );
}