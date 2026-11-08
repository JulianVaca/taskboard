import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bangers";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "./index.css";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);
