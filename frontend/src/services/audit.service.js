import api from "../api/axios";

/**
 * Service de gestion du journal d'audit
 * Consultation des logs d'activité
 */
const auditService = {
  /**
   * Récupérer tous les logs d'audit
   * @param {object} params - Filtres (action, user_id, date_from, date_to, result, page, limit)
   * @returns {Promise} Liste des logs
   */
  getAll: async (params = {}) => {
    const response = await api.get("/audit", { params });
    return response.data;
  },

  /**
   * Récupérer un log spécifique
   * @param {number|string} id
   * @returns {Promise} Détails du log
   */
  getById: async (id) => {
    const response = await api.get(`/audit/${id}`);
    return response.data;
  },

  /**
   * Récupérer les logs par type d'action
   * @param {string} action - Type d'action (LOGIN, LOGOUT, VOTE, etc.)
   * @param {object} params
   * @returns {Promise}
   */
  getByAction: async (action, params = {}) => {
    const response = await api.get("/audit", {
      params: { ...params, action },
    });
    return response.data;
  },

  /**
   * Récupérer les logs d'un utilisateur
   * @param {number|string} userId
   * @param {object} params
   * @returns {Promise}
   */
  getByUser: async (userId, params = {}) => {
    const response = await api.get("/audit", {
      params: { ...params, user_id: userId },
    });
    return response.data;
  },

  /**
   * Récupérer les logs d'une période
   * @param {string} dateFrom - Date de début (YYYY-MM-DD)
   * @param {string} dateTo - Date de fin (YYYY-MM-DD)
   * @param {object} params
   * @returns {Promise}
   */
  getByDateRange: async (dateFrom, dateTo, params = {}) => {
    const response = await api.get("/audit", {
      params: { ...params, date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  },

  /**
   * Récupérer les logs d'une élection
   * @param {number|string} electionId
   * @param {object} params
   * @returns {Promise}
   */
  getByElection: async (electionId, params = {}) => {
    const response = await api.get("/audit", {
      params: { ...params, election_id: electionId },
    });
    return response.data;
  },

  /**
   * Exporter les logs en CSV
   * @param {object} params - Filtres à appliquer
   * @returns {Promise} Blob du CSV
   */
  exportCSV: async (params = {}) => {
    const response = await api.get("/audit/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Récupérer les statistiques d'audit
   * @returns {Promise} Stats (actions par type, par jour, etc.)
   */
  getStats: async () => {
    const response = await api.get("/audit/stats");
    return response.data;
  },

  /**
   * Récupérer les types d'actions disponibles
   * @returns {Promise} Liste des types d'actions
   */
  getActionTypes: async () => {
    const response = await api.get("/audit/action-types");
    return response.data;
  },

  /**
   * Rechercher dans les logs
   * @param {string} query - Terme de recherche
   * @param {object} params
   * @returns {Promise}
   */
  search: async (query, params = {}) => {
    const response = await api.get("/audit/search", {
      params: { ...params, q: query },
    });
    return response.data;
  },
};

export default auditService;
