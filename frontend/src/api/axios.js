import axios from "axios";

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Créer l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en mode développement
    if (import.meta.env.DEV) {
      console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`, config.data || "");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et erreurs selon le guide Postman
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      stack: error.stack,
    };

    // Log détaillé en développement
    if (import.meta.env.DEV) {
      console.group(`🔴 API Error ${errorInfo.status || 'Network'} - ${errorInfo.url}`);
      console.error("Error Details:", errorInfo);
      console.groupEnd();
    }

    // Log persistant localStorage pour debug post-déploiement
    const errorLogs = JSON.parse(localStorage.getItem("api_error_logs") || "[]");
    errorLogs.push(errorInfo);
    // Garder seulement les 50 derniers logs
    if (errorLogs.length > 50) {
      errorLogs.shift();
    }
    localStorage.setItem("api_error_logs", JSON.stringify(errorLogs));

    // Gérer les erreurs d'authentification selon le guide Postman
// Dans l'intercepteur d'erreur axios.js
if (error.response?.status === 401) {
  // 🚨 Vérifier si c'est une erreur d'authentification réelle
  const isAuthEndpoint = error.config?.url?.includes('/auth/');
  
  if (isAuthEndpoint) {
    // Vraie erreur d'authentification (login/me/logout)
    console.warn("🔐 Session expired - redirecting to login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  } else {
    // Erreur de données (users/elections) - ne pas déconnecter
    console.warn("🔐 Data access denied - keeping session");
  }
}

    // Gérer erreurs 403 (accès refusé selon le guide Postman)
    if (error.response?.status === 403) {
      console.warn("🚫 Access denied - insufficient role");
      // Ne pas déconnecter, juste afficher l'erreur
    }

    // Gérer erreurs 429 (trop de tentatives selon le guide Postman)
    if (error.response?.status === 429) {
      console.warn("⏱️ Too many requests - rate limit exceeded");
    }

    // Gérer erreurs réseau/serveur
    if (!error.response) {
      console.error("🌐 Network Error - Server unreachable?", errorInfo);
    }

    // Gérer erreurs 5xx
    if (error.response?.status >= 500) {
      console.error("🔥 Server Error - Backend issue", errorInfo);
    }

    // Gérer erreurs 4xx (sauf 401 déjà géré)
    if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 401) {
      console.warn("⚠️ Client Error - Request issue", errorInfo);
    }

    return Promise.reject(error);
  }
);

export default api;

// Export de l'URL de base pour d'autres usages
export { API_BASE_URL };
