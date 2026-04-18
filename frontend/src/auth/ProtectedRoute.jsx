import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const hierarchy = { visitor: 0, voter: 1, auditor: 2, admin: 3, super_admin: 4 };

const toRoleList = (requiredRole) => {
  if (Array.isArray(requiredRole)) return requiredRole;
  return [requiredRole];
};

const ProtectedRoute = ({ children, requiredRole = "voter" }) => {
  const { role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentLevel = hierarchy[role] ?? -1;
  const allowedRoles = toRoleList(requiredRole);
  const allowed = allowedRoles.some((candidate) => currentLevel >= (hierarchy[candidate] ?? Number.MAX_SAFE_INTEGER));

  if (!allowed) {
    if (role === "auditor") {
      return <Navigate to="/admin/audit" replace />;
    }
    if (role === "admin" || role === "super_admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "voter") {
      return <Navigate to="/electeur" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
