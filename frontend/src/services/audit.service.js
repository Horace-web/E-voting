import api from "../api/axios";
import API_ROUTES from "../config/api.routes";

const getWithFallback = async (primary, fallback, options = {}) => {
  try {
    return await api.get(primary, options);
  } catch (error) {
    const status = error?.response?.status;
    if (!fallback || (status && status !== 404)) {
      throw error;
    }
    return api.get(fallback, options);
  }
};

const auditService = {
  getAll: async (params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.LOGS, "/audit", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await getWithFallback(`${API_ROUTES.AUDIT.LOGS}/${id}`, `/audit/${id}`);
    return response.data;
  },

  getByAction: async (action, params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.LOGS, "/audit", {
      params: { ...params, action },
    });
    return response.data;
  },

  getByUser: async (userId, params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.LOGS, "/audit", {
      params: { ...params, user_id: userId },
    });
    return response.data;
  },

  getByDateRange: async (dateFrom, dateTo, params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.LOGS, "/audit", {
      params: { ...params, date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  },

  getByElection: async (electionId, params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.LOGS, "/audit", {
      params: { ...params, election_id: electionId },
    });
    return response.data;
  },

  exportCSV: async (params = {}) => {
    const response = await getWithFallback(API_ROUTES.AUDIT.EXPORT_CSV, "/audit/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  getStats: async () => {
    const response = await getWithFallback("/audit/stats", null);
    return response.data;
  },

  getActionTypes: async () => {
    const response = await getWithFallback("/audit/action-types", null);
    return response.data;
  },

  search: async (query, params = {}) => {
    const response = await getWithFallback("/audit/search", null, {
      params: { ...params, q: query },
    });
    return response.data;
  },
};

export default auditService;
