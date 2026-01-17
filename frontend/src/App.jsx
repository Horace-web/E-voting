import React, { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <Landing onNavigate={setCurrentPage} />;
      case "login":
        return <Login onNavigate={setCurrentPage} />;
      case "register":
        return <Register onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
