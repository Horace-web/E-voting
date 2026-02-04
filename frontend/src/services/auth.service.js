import api from "../api/axios";

/**
 * Service d'authentification
 * Gère la connexion, déconnexion, OTP et gestion du profil
 */
const authService = {
  /**
   * Demander l'envoi d'un code OTP
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise} Réponse de l'API
   */
  sendOTP: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },

  /**
   * Vérifier le code OTP et se connecter
   * @param {string} email - Email de l'utilisateur
   * @param {string} otp - Code OTP à 6 chiffres
   * @returns {Promise} Données utilisateur + token
   */
  verifyOTP: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });

    // Stocker le token et les infos utilisateur
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role || "voter");
    }

    return response.data;
  },

  /**
   * Déconnexion
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   * @returns {Promise} Données du profil
   */
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  /**
   * Mettre à jour le profil
   * @param {object} data - Données à mettre à jour
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Renvoyer un code OTP
   * @param {string} email
   * @returns {Promise}
   */
  resendOTP: async (email) => {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Récupérer le token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Récupérer l'utilisateur stocké
   * @returns {object|null}
   */
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Récupérer le rôle
   * @returns {string}
   */
  getRole: () => {
    return localStorage.getItem("role") || "visitor";
  },
};

export default authService;
