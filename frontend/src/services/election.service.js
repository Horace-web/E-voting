import api from "../api/axios";

/**
 * Service de gestion des élections
 * CRUD complet + gestion du statut des élections
 */
const electionService = {
  /**
   * Récupérer toutes les élections
   * @param {object} params - Filtres optionnels (status, search, page, limit)
   * @returns {Promise} Liste des élections
   */
  getAll: async (params = {}) => {
    const response = await api.get("/elections", { params });
    return response.data;
  },

  /**
   * Récupérer une élection par ID
   * @param {number|string} id
   * @returns {Promise} Détails de l'élection
   */
  getById: async (id) => {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle élection
   * @param {object} data - Données de l'élection
   * @returns {Promise} Élection créée
   */
  create: async (data) => {
    const response = await api.post("/elections", data);
    return response.data;
  },

  /**
   * Mettre à jour une élection
   * @param {number|string} id
   * @param {object} data
   * @returns {Promise} Élection mise à jour
   */
  update: async (id, data) => {
    const response = await api.put(`/elections/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une élection
   * @param {number|string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/elections/${id}`);
    return response.data;
  },

  /**
   * Publier une élection (la rendre active)
   * @param {number|string} id
   * @returns {Promise}
   */
  publish: async (id) => {
    const response = await api.post(`/elections/${id}/publish`);
    return response.data;
  },

  /**
   * Clôturer une élection
   * @param {number|string} id
   * @returns {Promise}
   */
  close: async (id) => {
    const response = await api.post(`/elections/${id}/close`);
    return response.data;
  },

  /**
   * Archiver une élection
   * @param {number|string} id
   * @returns {Promise}
   */
  archive: async (id) => {
    const response = await api.post(`/elections/${id}/archive`);
    return response.data;
  },

  /**
   * Récupérer les élections actives (pour les électeurs)
   * @returns {Promise} Liste des élections en cours
   */
  getActive: async () => {
    const response = await api.get("/elections/active");
    return response.data;
  },

  /**
   * Récupérer les élections auxquelles l'utilisateur peut voter
   * @returns {Promise}
   */
  getAvailableForVoting: async () => {
    const response = await api.get("/elections/available");
    return response.data;
  },

  /**
   * Récupérer les élections clôturées (pour voir les résultats)
   * @returns {Promise}
   */
  getClosed: async () => {
    const response = await api.get("/elections/closed");
    return response.data;
  },

  /**
   * Récupérer les statistiques d'une élection
   * @param {number|string} id
   * @returns {Promise} Statistiques (votes, participation, etc.)
   */
  getStats: async (id) => {
    const response = await api.get(`/elections/${id}/stats`);
    return response.data;
  },

  /**
   * Récupérer les candidats d'une élection
   * @param {number|string} electionId
   * @returns {Promise} Liste des candidats
   */
  getCandidates: async (electionId) => {
    const response = await api.get(`/elections/${electionId}/candidates`);
    return response.data;
  },

  /**
   * Ajouter un candidat à une élection
   * @param {number|string} electionId
   * @param {number|string} candidateId
   * @returns {Promise}
   */
  addCandidate: async (electionId, candidateId) => {
    const response = await api.post(`/elections/${electionId}/candidates`, {
      candidate_id: candidateId,
    });
    return response.data;
  },

  /**
   * Retirer un candidat d'une élection
   * @param {number|string} electionId
   * @param {number|string} candidateId
   * @returns {Promise}
   */
  removeCandidate: async (electionId, candidateId) => {
    const response = await api.delete(`/elections/${electionId}/candidates/${candidateId}`);
    return response.data;
  },
};

export default electionService;
