import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AiSettingsProvider } from "./context/AiSettingsContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AiSettingsProvider>
      <App />
    </AiSettingsProvider>
  </BrowserRouter>,
);
