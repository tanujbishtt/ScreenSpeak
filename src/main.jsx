import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AiSettingsProvider } from "./context/AiSettingsContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AiSettingsProvider>
        <App />
      </AiSettingsProvider>
    </ThemeProvider>
  </BrowserRouter>
);