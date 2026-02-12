import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import AppThemeProvider from "./theme/ThemeProvider.jsx";
import "./index.css";
import App from "./App.jsx";
import "./utils/debug.js"; // Charger les utilitaires de debug

createRoot(document.getElementById("root")).render(
  <AppThemeProvider>
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </AuthProvider>
  </AppThemeProvider>
);
