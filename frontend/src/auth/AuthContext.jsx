import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service.js";

const AuthContext = createContext(null);

const normalizeRole = (value) => {
  const role = String(value || "").trim().toUpperCase();

  if (role === "ADMINISTRATEUR") return "admin";
  if (role === "AUDITEUR") return "auditor";
  if (role === "ELECTEUR" || role === "ELECTOR" || role === "VOTANT") return "voter";
  if (role === "ADMIN") return "admin";
  if (role === "AUDITOR") return "auditor";
  if (role === "VOTER") return "voter";

  return "visitor";
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit Ãªtre utilisÃ© dans un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("visitor");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const response = await authService.getProfile();

        if (response.success && response.user) {
          const normalizedRole = normalizeRole(response.user.role);
          setUser(response.user);
          setRole(normalizedRole);
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("role", normalizedRole);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
        }
      } catch (error) {
        console.warn("Token invalide au dÃ©marrage:", error.response?.status);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, userRole = "voter") => {
    const normalizedRole = normalizeRole(userRole);
    setUser(userData);
    setRole(normalizedRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", normalizedRole);
  };

  const logout = () => {
    setUser(null);
    setRole("visitor");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  if (!isInitialized) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Chargement...
      </div>
    );
  }

  const value = {
    user,
    role,
    isAuthenticated: !!user && role !== "visitor",
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
