import api from "../api/axios";

/**
 * Service de gestion des résultats
 * Consultation et publication des résultats
 */
const resultService = {
  /**
   * Récupérer les résultats d'une élection
   * @param {number|string} electionId
   * @returns {Promise} Résultats détaillés
   */
  getByElection: async (electionId) => {
    const response = await api.get(`/results/${electionId}`);
    return response.data;
  },

  /**
   * Récupérer tous les résultats publiés
   * @param {object} params - Filtres (page, limit)
   * @returns {Promise} Liste des résultats
   */
  getPublished: async (params = {}) => {
    const response = await api.get("/results", { params });
    return response.data;
  },

  /**
   * Récupérer les résultats détaillés avec statistiques
   * @param {number|string} electionId
   * @returns {Promise} Résultats + stats
   */
  getDetailed: async (electionId) => {
    const response = await api.get(`/results/${electionId}/detailed`);
    return response.data;
  },

  /**
   * Récupérer le classement des candidats
   * @param {number|string} electionId
   * @returns {Promise} Liste ordonnée des candidats avec votes
   */
  getRanking: async (electionId) => {
    const response = await api.get(`/results/${electionId}/ranking`);
    return response.data;
  },

  /**
   * Récupérer les statistiques de participation
   * @param {number|string} electionId
   * @returns {Promise} Stats de participation
   */
  getParticipation: async (electionId) => {
    const response = await api.get(`/results/${electionId}/participation`);
    return response.data;
  },

  /**
   * Exporter les résultats en PDF
   * @param {number|string} electionId
   * @returns {Promise} Blob du PDF
   */
  exportPDF: async (electionId) => {
    const response = await api.get(`/results/${electionId}/export/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Exporter les résultats en CSV
   * @param {number|string} electionId
   * @returns {Promise} Blob du CSV
   */
  exportCSV: async (electionId) => {
    const response = await api.get(`/results/${electionId}/export/csv`, {
      responseType: "blob",
    });
    return response.data;
  },

  // ============ ADMIN ONLY ============

  /**
   * Publier les résultats d'une élection
   * @param {number|string} electionId
   * @returns {Promise}
   */
  publish: async (electionId) => {
    const response = await api.post(`/admin/results/${electionId}/publish`);
    return response.data;
  },

  /**
   * Dépublier les résultats (retirer de la vue publique)
   * @param {number|string} electionId
   * @returns {Promise}
   */
  unpublish: async (electionId) => {
    const response = await api.post(`/admin/results/${electionId}/unpublish`);
    return response.data;
  },

  /**
   * Récupérer tous les résultats (publiés ou non) - Admin
   * @param {object} params
   * @returns {Promise}
   */
  getAllAdmin: async (params = {}) => {
    const response = await api.get("/admin/results", { params });
    return response.data;
  },

  /**
   * Récupérer les résultats en temps réel (pendant le vote)
   * @param {number|string} electionId
   * @returns {Promise} Résultats partiels
   */
  getLiveResults: async (electionId) => {
    const response = await api.get(`/admin/results/${electionId}/live`);
    return response.data;
  },

  /**
   * Générer le rapport officiel des résultats
   * @param {number|string} electionId
   * @returns {Promise} URL du rapport
   */
  generateReport: async (electionId) => {
    const response = await api.post(`/admin/results/${electionId}/report`);
    return response.data;
  },
};

export default resultService;
