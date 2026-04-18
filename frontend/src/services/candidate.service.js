import api from "../api/axios";
import API_ROUTES from "../config/api.routes";

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
    if (params.election_id) {
      const response = await api.get(API_ROUTES.ELECTIONS.CANDIDATES(params.election_id));
      return response.data;
    }

    const response = await api.get(API_ROUTES.ELECTIONS.LIST);
    return response.data;
  },

  /**
   * Récupérer un candidat par ID
   * @param {number|string} id
   * @returns {Promise} Détails du candidat
   */
  getById: async (id) => {
    const response = await api.get(API_ROUTES.CANDIDATES.GET(id));
    return response.data;
  },

  /**
   * Créer un nouveau candidat
   * @param {object} data - Données du candidat
   * @returns {Promise} Candidat créé
   */
  create: async (data) => {
    const electionId = data.election_id || data.electionId;
    const payload = {
      nom: data.nom,
      programme: data.programme || undefined,
      photo_path: data.photo_path || undefined,
    };

    const response = await api.post(API_ROUTES.CANDIDATES.CREATE(electionId), payload);
    return response.data;
  },

  /**
   * Créer un candidat avec photo (FormData)
   * @param {FormData} formData - Données incluant la photo
   * @returns {Promise} Candidat créé
   */
  createWithPhoto: async (formData) => {
    const electionId = formData.get("election_id");
    const nom = formData.get("nom");
    const programme = formData.get("programme");
    const photo = formData.get("photo");

    let photoPath;
    if (photo instanceof File && photo.size > 0) {
      const uploadData = new FormData();
      uploadData.append("photo", photo);
      const uploadResponse = await api.post(API_ROUTES.UPLOAD.PHOTO, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      photoPath = uploadResponse.data?.photo_path || uploadResponse.data?.data?.photo_path;
    }

    const payload = {
      nom,
      programme: programme || undefined,
      photo_path: photoPath,
    };

    const response = await api.post(API_ROUTES.CANDIDATES.CREATE(electionId), payload);
    return response.data;
  },

  /**
   * Mettre à jour un candidat
   * @param {number|string} id
   * @param {object} data
   * @returns {Promise} Candidat mis à jour
   */
  update: async (id, data) => {
    const response = await api.put(API_ROUTES.CANDIDATES.UPDATE(id), data);
    return response.data;
  },

  /**
   * Mettre à jour un candidat avec photo
   * @param {number|string} id
   * @param {FormData} formData
   * @returns {Promise}
   */
  updateWithPhoto: async (id, formData) => {
    const uploadData = new FormData();
    const photo = formData.get("photo");

    if (photo instanceof File && photo.size > 0) {
      uploadData.append("photo", photo);
      const uploadResponse = await api.post(API_ROUTES.UPLOAD.PHOTO, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const photoPath = uploadResponse.data?.photo_path || uploadResponse.data?.data?.photo_path;
      formData.set("photo_path", photoPath || "");
    }

    const payload = Object.fromEntries(formData.entries());
    const response = await api.put(API_ROUTES.CANDIDATES.UPDATE(id), payload);
    return response.data;
  },

  /**
   * Supprimer un candidat
   * @param {number|string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(API_ROUTES.CANDIDATES.DELETE(id));
    return response.data;
  },

  /**
   * Récupérer les candidats d'une élection spécifique
   * @param {number|string} electionId
   * @returns {Promise} Liste des candidats
   */
  getByElection: async (electionId) => {
    const response = await api.get(API_ROUTES.ELECTIONS.CANDIDATES(electionId));
    return response.data;
  },

  /**
   * Mettre à jour l'ordre d'affichage des candidats
   * @param {number|string} electionId
   * @param {array} candidateIds - Liste ordonnée des IDs
   * @returns {Promise}
   */
  updateOrder: async (electionId, candidateIds) => {
    const response = await api.post(`/elections/${electionId}/candidats/order`, {
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

    const response = await api.post(API_ROUTES.UPLOAD.PHOTO, formData, {
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
    const response = await api.delete(`${API_ROUTES.CANDIDATES.DELETE(id)}/photo`);
    return response.data;
  },
};

export default candidateService;
