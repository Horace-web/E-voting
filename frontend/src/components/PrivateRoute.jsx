import { Navigate } from "react-router-dom";

/**
 * Composant de protection des routes selon le guide Postman
 * Vérifie l'authentification et les rôles autorisés
 */
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" />;
  }
  
  return children;
}

export default PrivateRoute;
