import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("visitor");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Validation au démarrage
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
        
        if (response.success) {
          const storedUser = localStorage.getItem("user");
          const storedRole = localStorage.getItem("role");
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole || "voter");
          }
        } else {
          localStorage.clear();
        }
      } catch (error) {
        console.warn("Token invalide au démarrage:", error.response?.status);
        localStorage.clear();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, userRole = "voter") => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setUser(null);
    setRole("visitor");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  // 🎯 Le return de chargement doit être ici
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Chargement...
      </div>
    );
  }

  const value = {
    user,
    role,
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