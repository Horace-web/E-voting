import api from "../api/axios";

/**
 * Service de gestion des votes
 * Soumission de vote et historique
 */
const voteService = {
  /**
   * Soumettre un vote
   * @param {number|string} electionId - ID de l'élection
   * @param {number|string} candidateId - ID du candidat choisi
   * @returns {Promise} Confirmation du vote
   */
  submit: async (electionId, candidateId) => {
    const response = await api.post("/votes", {
      election_id: electionId,
      candidate_id: candidateId,
    });
    return response.data;
  },

  /**
   * Vérifier si l'utilisateur a déjà voté pour une élection
   * @param {number|string} electionId
   * @returns {Promise} { hasVoted: boolean }
   */
  hasVoted: async (electionId) => {
    const response = await api.get(`/votes/check/${electionId}`);
    return response.data;
  },

  /**
   * Récupérer l'historique des votes de l'utilisateur connecté
   * @param {object} params - Filtres (page, limit)
   * @returns {Promise} Liste des participations
   */
  getHistory: async (params = {}) => {
    const response = await api.get("/votes/history", { params });
    return response.data;
  },

  /**
   * Récupérer les détails d'une participation
   * @param {number|string} voteId
   * @returns {Promise} Détails du vote (sans révéler le choix)
   */
  getVoteDetails: async (voteId) => {
    const response = await api.get(`/votes/${voteId}`);
    return response.data;
  },

  /**
   * Récupérer le reçu de vote (preuve de participation)
   * @param {number|string} electionId
   * @returns {Promise} Données du reçu
   */
  getReceipt: async (electionId) => {
    const response = await api.get(`/votes/receipt/${electionId}`);
    return response.data;
  },

  /**
   * Télécharger le reçu de vote en PDF
   * @param {number|string} electionId
   * @returns {Promise} Blob du PDF
   */
  downloadReceipt: async (electionId) => {
    const response = await api.get(`/votes/receipt/${electionId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Vérifier l'éligibilité de l'utilisateur pour voter
   * @param {number|string} electionId
   * @returns {Promise} { eligible: boolean, reason?: string }
   */
  checkEligibility: async (electionId) => {
    const response = await api.get(`/votes/eligibility/${electionId}`);
    return response.data;
  },

  // ============ ADMIN ONLY ============

  /**
   * Récupérer tous les votes d'une élection (admin)
   * @param {number|string} electionId
   * @param {object} params
   * @returns {Promise} Liste des votes (anonymisés)
   */
  getByElection: async (electionId, params = {}) => {
    const response = await api.get(`/admin/elections/${electionId}/votes`, {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer les statistiques de vote d'une élection
   * @param {number|string} electionId
   * @returns {Promise} Statistiques détaillées
   */
  getElectionStats: async (electionId) => {
    const response = await api.get(`/admin/elections/${electionId}/votes/stats`);
    return response.data;
  },

  /**
   * Valider/Invalider un vote (admin - cas exceptionnels)
   * @param {number|string} voteId
   * @param {boolean} valid
   * @param {string} reason
   * @returns {Promise}
   */
  validateVote: async (voteId, valid, reason) => {
    const response = await api.put(`/admin/votes/${voteId}/validate`, {
      valid,
      reason,
    });
    return response.data;
  },
};

export default voteService;
