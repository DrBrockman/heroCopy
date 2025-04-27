import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";
import { PatientProvider } from "./PatientContext";


import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <PatientProvider> {/* Wrap App with Provider */}
        <App />
      </PatientProvider>
    </HashRouter>
  </React.StrictMode>,
);
