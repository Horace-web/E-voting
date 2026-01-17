import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Otp from "../pages/Otp";
import Vote from "../pages/Vote";
import Results from "../pages/Results";
import Admin from "../pages/Admin";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />

      {/* Protected Routes */}
      <Route path="/vote" element={<Vote />} />
      <Route path="/results" element={<Results />} />
      <Route path="/admin" element={<Admin />} />

      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
