import api from "../api/axios";
import API_ROUTES from "../config/api.routes";

/**
 * Service d'authentification
 * Gère la connexion, déconnexion, confirmation d'inscription et gestion du profil
 */
const authService = {
  /**
   * Connexion avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise} Données utilisateur + token
   */
  login: async (email, password) => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, { email, password });

    // Stocker le token et les infos utilisateur
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role || "voter");
    }

    return response.data;
  },

  /**
   * Confirmer l'inscription via le token reçu par email
   * @param {string} token - Token de confirmation (64 caractères)
   * @returns {Promise} Données de confirmation
   */
  confirmAccount: async (token) => {
    const response = await api.get(API_ROUTES.AUTH.CONFIRM(token));
    return response.data;
  },

  /**
   * Déconnexion
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
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
    const response = await api.get(API_ROUTES.AUTH.PROFILE);
    return response.data;
  },

  /**
   * Mettre à jour le profil
   * @param {object} data - Données à mettre à jour
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    const response = await api.put(API_ROUTES.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },

  /**
   * Demander un nouveau lien de confirmation
   * @param {string} email
   * @returns {Promise}
   */
  resendConfirmationLink: async (email) => {
    const response = await api.post(API_ROUTES.AUTH.RESEND_CONFIRMATION, { email });
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
