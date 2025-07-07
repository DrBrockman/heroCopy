import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx"; // Import the Provider

import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Provider>
        {" "}
        {/* Wrap App with Provider */}
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
