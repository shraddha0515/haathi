import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (e) {
    return <h1 style={{ color: "red" }}>App crashed: {e.message}</h1>;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
