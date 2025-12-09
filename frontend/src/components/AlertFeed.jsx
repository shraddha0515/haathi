import "./AlertFeed.css";
import React from "react";
export default function AlertFeed({ alerts = [] }) {
  return (
    <div className="alert-feed">
      <h3>⚠ Recent Alerts</h3>
      {alerts.length === 0 ? (
        <p>No alerts yet</p>
      ) : (
        alerts.map((a, i) => (
          <div className="alert-card" key={i}>
            <b>{a.type}</b>
            <p>{a.message}</p>
            <small>{a.time}</small>
          </div>
        ))
      )}
    </div>
  );
}
