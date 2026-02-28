import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { BackgroundProvider } from "./components/background/BackgroundProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <BackgroundProvider>
          <App />
        </BackgroundProvider>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
