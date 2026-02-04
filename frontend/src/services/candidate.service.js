import api from "../api/axios";

/**
 * Service de gestion des candidats
 * CRUD complet avec gestion des photos
 */
const candidateService = {
  /**
   * Récupérer tous les candidats
   * @param {object} params - Filtres (election_id, search, page, limit)
   * @returns {Promise} Liste des candidats
   */
  getAll: async (params = {}) => {
    const response = await api.get("/candidates", { params });
    return response.data;
  },

  /**
   * Récupérer un candidat par ID
   * @param {number|string} id
   * @returns {Promise} Détails du candidat
   */
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau candidat
   * @param {object} data - Données du candidat
   * @returns {Promise} Candidat créé
   */
  create: async (data) => {
    const response = await api.post("/candidates", data);
    return response.data;
  },

  /**
   * Créer un candidat avec photo (FormData)
   * @param {FormData} formData - Données incluant la photo
   * @returns {Promise} Candidat créé
   */
  createWithPhoto: async (formData) => {
    const response = await api.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Mettre à jour un candidat
   * @param {number|string} id
   * @param {object} data
   * @returns {Promise} Candidat mis à jour
   */
  update: async (id, data) => {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  },

  /**
   * Mettre à jour un candidat avec photo
   * @param {number|string} id
   * @param {FormData} formData
   * @returns {Promise}
   */
  updateWithPhoto: async (id, formData) => {
    // Pour PUT avec FormData, on utilise POST avec _method
    formData.append("_method", "PUT");
    const response = await api.post(`/candidates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Supprimer un candidat
   * @param {number|string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },

  /**
   * Récupérer les candidats d'une élection spécifique
   * @param {number|string} electionId
   * @returns {Promise} Liste des candidats
   */
  getByElection: async (electionId) => {
    const response = await api.get("/candidates", {
      params: { election_id: electionId },
    });
    return response.data;
  },

  /**
   * Mettre à jour l'ordre d'affichage des candidats
   * @param {number|string} electionId
   * @param {array} candidateIds - Liste ordonnée des IDs
   * @returns {Promise}
   */
  updateOrder: async (electionId, candidateIds) => {
    const response = await api.post(`/elections/${electionId}/candidates/order`, {
      candidate_ids: candidateIds,
    });
    return response.data;
  },

  /**
   * Uploader la photo d'un candidat
   * @param {number|string} id
   * @param {File} file
   * @returns {Promise} URL de la photo
   */
  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post(`/candidates/${id}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Supprimer la photo d'un candidat
   * @param {number|string} id
   * @returns {Promise}
   */
  deletePhoto: async (id) => {
    const response = await api.delete(`/candidates/${id}/photo`);
    return response.data;
  },
};

export default candidateService;
