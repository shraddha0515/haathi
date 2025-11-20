import "./Sidebar.css";

export default function Sidebar({ alerts = [] }) {
  return (
    <div className="sidebar">
      <h2>🦣 HAATHI DASHBOARD</h2>

      <div className="menu">
        <button>📍 Live Tracking</button>
        <button>⚠ Alerts</button>
        <button>📊 Analytics</button>
      </div>

      <div className="footer">
        <p>Environment Monitoring System</p>
      </div>
    </div>
  );
}
