import { useState, useEffect, useCallback } from "react";
import config, { delay } from "../config/app.config";

/**
 * Hook générique pour les appels API avec gestion du loading et des erreurs
 *
 * @param {Function} apiFunction - Fonction du service API à appeler
 * @param {object} options - Options (autoFetch, mockData, deps)
 * @returns {object} { data, loading, error, refetch, setData }
 */
export const useApi = (apiFunction, options = {}) => {
  const { autoFetch = true, mockData = null, deps = [], params = null } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    async (fetchParams = params) => {
      setLoading(true);
      setError(null);

      try {
        // Mode mock
        if (config.useMockData && mockData !== null) {
          await delay();
          setData(typeof mockData === "function" ? mockData(fetchParams) : mockData);
          return mockData;
        }

        // Appel API réel
        const result = await apiFunction(fetchParams);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Une erreur est survenue";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, mockData, params]
  );

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [...deps, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    setData,
  };
};

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 *
 * @param {Function} apiFunction - Fonction du service API
 * @param {object} options - Options (onSuccess, onError)
 * @returns {object} { mutate, loading, error, data }
 */
export const useMutation = (apiFunction, options = {}) => {
  const { onSuccess, onError, mockResponse } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        let result;

        // Mode mock
        if (config.useMockData && mockResponse !== undefined) {
          await delay();
          result = typeof mockResponse === "function" ? mockResponse(...args) : mockResponse;
        } else {
          // Appel API réel
          result = await apiFunction(...args);
        }

        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Une erreur est survenue";
        setError(errorMessage);
        onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, mockResponse]
  );

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
};

/**
 * Hook pour la pagination
 *
 * @param {Function} apiFunction - Fonction du service API
 * @param {object} options - Options (mockData, pageSize)
 * @returns {object} { data, loading, page, setPage, totalPages, ... }
 */
export const usePagination = (apiFunction, options = {}) => {
  const { mockData, pageSize = 10, initialPage = 1 } = options;

  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, refetch } = useApi(() => apiFunction({ page, limit: pageSize }), {
    mockData: mockData
      ? () => ({
          data: mockData.slice((page - 1) * pageSize, page * pageSize),
          total: mockData.length,
          page,
          totalPages: Math.ceil(mockData.length / pageSize),
        })
      : null,
    deps: [page, pageSize],
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || Math.ceil(data.total / pageSize));
      setTotalItems(data.total || 0);
    }
  }, [data, pageSize]);

  return {
    data: data?.data || [],
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    refetch,
  };
};

export default {
  useApi,
  useMutation,
  usePagination,
};
