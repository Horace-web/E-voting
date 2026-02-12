import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./App.css";

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <ErrorBoundary resetKey={location.pathname}>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
}

export default App;
