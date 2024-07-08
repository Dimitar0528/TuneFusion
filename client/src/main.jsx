import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <MusicPlayerProvider>
        <App />
      </MusicPlayerProvider>
    </Router>
  </React.StrictMode>
);
