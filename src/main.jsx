import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore.js";
import { ThemeProvider } from "./lib/theme-provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Provider store={appStore}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
