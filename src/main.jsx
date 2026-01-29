import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// استدعاء الـ Bootstrap والـ CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// استخدام HashRouter بدل BrowserRouter عشان GitHub Pages
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
