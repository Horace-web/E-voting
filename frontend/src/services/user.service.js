import api from "../api/axios";

/**
 * Service de gestion des utilisateurs
 * CRUD complet + gestion des rôles et import/export
 */
const userService = {
  /**
   * Récupérer tous les utilisateurs
   * @param {object} params - Filtres (role, status, search, page, limit)
   * @returns {Promise} Liste des utilisateurs
   */
  getAll: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  /**
   * Récupérer un utilisateur par ID
   * @param {number|string} id
   * @returns {Promise} Détails de l'utilisateur
   */
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Créer un nouvel utilisateur
   * @param {object} data - Données de l'utilisateur
   * @returns {Promise} Utilisateur créé
   */
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  /**
   * Mettre à jour un utilisateur
   * @param {number|string} id
   * @param {object} data
   * @returns {Promise} Utilisateur mis à jour
   */
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un utilisateur
   * @param {number|string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Activer un utilisateur
   * @param {number|string} id
   * @returns {Promise}
   */
  activate: async (id) => {
    const response = await api.post(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Désactiver un utilisateur
   * @param {number|string} id
   * @returns {Promise}
   */
  deactivate: async (id) => {
    const response = await api.post(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Changer le rôle d'un utilisateur
   * @param {number|string} id
   * @param {string} role - Nouveau rôle (voter, admin, auditor)
   * @returns {Promise}
   */
  changeRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  /**
   * Importer des utilisateurs depuis un fichier CSV
   * @param {File} file - Fichier CSV
   * @returns {Promise} Résultat de l'import
   */
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Exporter les utilisateurs en CSV
   * @param {object} params - Filtres optionnels
   * @returns {Promise} Blob du fichier CSV
   */
  exportCSV: async (params = {}) => {
    const response = await api.get("/users/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Récupérer les statistiques des utilisateurs
   * @returns {Promise} Statistiques (total, par rôle, actifs, etc.)
   */
  getStats: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  /**
   * Récupérer les électeurs (utilisateurs avec rôle voter)
   * @param {object} params
   * @returns {Promise}
   */
  getVoters: async (params = {}) => {
    const response = await api.get("/users", {
      params: { ...params, role: "voter" },
    });
    return response.data;
  },

  /**
   * Récupérer les admins
   * @param {object} params
   * @returns {Promise}
   */
  getAdmins: async (params = {}) => {
    const response = await api.get("/users", {
      params: { ...params, role: "admin" },
    });
    return response.data;
  },

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   * @param {number|string} id
   * @returns {Promise}
   */
  resetPassword: async (id) => {
    const response = await api.post(`/users/${id}/reset-password`);
    return response.data;
  },

  /**
   * Vérifier si un email existe déjà
   * @param {string} email
   * @returns {Promise} { exists: boolean }
   */
  checkEmail: async (email) => {
    const response = await api.post("/users/check-email", { email });
    return response.data;
  },
};

export default userService;
