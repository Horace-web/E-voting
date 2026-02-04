import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Otp from "../pages/Otp";
import Vote from "../pages/Vote";
import Results from "../pages/Results";
import Admin from "../pages/Admin";
import ElecteurSpace from "../pages/ElecteurSpace";

// Admin Pages
import Elections from "../pages/admin/Elections";
import Candidats from "../pages/admin/Candidats";
import Utilisateurs from "../pages/admin/Utilisateurs";
import Resultats from "../pages/admin/Resultats";
import Audit from "../pages/admin/Audit";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/elections" element={<Landing />} />
      <Route path="/results" element={<Results />} />

      {/* Protected Routes - Électeur */}
      <Route
        path="/electeur/*"
        element={
          <ProtectedRoute requiredRole="voter">
            <ElecteurSpace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vote"
        element={
          <ProtectedRoute requiredRole="voter">
            <Vote />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/elections"
        element={
          <ProtectedRoute requiredRole="admin">
            <Elections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/candidats"
        element={
          <ProtectedRoute requiredRole="admin">
            <Candidats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <ProtectedRoute requiredRole="admin">
            <Utilisateurs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/resultats"
        element={
          <ProtectedRoute requiredRole="admin">
            <Resultats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute requiredRole="admin">
            <Audit />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
