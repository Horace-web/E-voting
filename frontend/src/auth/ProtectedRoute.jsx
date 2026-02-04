import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Mode développement - mettre à false en production
const DEV_MODE = true;

// Hiérarchie simple : visitor < voter < admin < super_admin
const hierarchy = { visitor: 0, voter: 1, admin: 2, super_admin: 3 };

const ProtectedRoute = ({ children, requiredRole = "voter" }) => {
  const { role, isLoading } = useAuth();

  // En mode développement, autoriser tout accès
  if (DEV_MODE) {
    return children;
  }

  // Attendre que l'authentification soit chargée
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    );
  }

  const allowed = hierarchy[role] >= hierarchy[requiredRole];
  if (!allowed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
