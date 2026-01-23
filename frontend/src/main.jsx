import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./style.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
