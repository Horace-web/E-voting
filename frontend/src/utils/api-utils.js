/**
 * Utilitaires pour la manipulation des données API
 */

/**
 * Normalise une réponse API Laravel pour extraire les données réelles.
 * Gère les cas suivants :
 * - Tableau direct : [...]
 * - Objet avec data : { data: [...] }
 * - Pagination Laravel : { data: { data: [...], current_page: 1 } }
 * 
 * @param {any} response - La réponse brute de l'API (généralement response.data)
 * @returns {Array} - Un tableau de données (vide si rien trouvé)
 */
export const normalizeApiResponse = (response) => {
  if (!response) return [];

  // Si c'est déjà un tableau, on le renvoie tel quel
  if (Array.isArray(response)) return response;

  // Souvent axios renvoie l'objet entier, on cherche le payload
  // Si success est présent, c'est l'enveloppe standard de notre backend
  const payload = response.data !== undefined ? response.data : response;

  // Cas 1 : Le payload est directement le tableau
  if (Array.isArray(payload)) return payload;

  // Cas 2 : Le payload contient un champ data qui est le tableau
  if (payload && Array.isArray(payload.data)) return payload.data;

  // Cas 3 : Pagination Laravel (le payload a un champ data qui contient lui-même un champ data)
  if (payload && payload.data && Array.isArray(payload.data.data)) {
    return payload.data.data;
  }

  // Cas 4 : Un champ spécifique comme 'items', 'elections', 'candidates', etc.
  const otherLists = ['items', 'elections', 'candidates', 'candidats', 'users', 'results'];
  for (const key of otherLists) {
    if (payload && Array.isArray(payload[key])) return payload[key];
  }

  return [];
};

/**
 * Extrait les métadonnées de pagination d'une réponse Laravel
 * @param {any} response 
 */
export const extractPagination = (response) => {
  const payload = response?.data || response;
  if (payload && payload.current_page) {
    const { data, ...pagination } = payload;
    return pagination;
  }
  return null;
};
