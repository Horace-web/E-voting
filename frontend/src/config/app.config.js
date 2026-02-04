/**
 * Configuration de l'application
 * Gère le mode développement/production et les options de mock
 */

// Mode de l'application
export const config = {
  // Activer le mode mock (données simulées sans backend)
  useMockData: import.meta.env.VITE_USE_MOCK === "true" || true, // Par défaut true pour le dev

  // URL de l'API
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  // Mode développement
  isDev: import.meta.env.DEV,

  // Mode production
  isProd: import.meta.env.PROD,

  // Délai simulé pour les requêtes mock (ms)
  mockDelay: 500,

  // Activer les logs de debug
  debug: import.meta.env.DEV,
};

/**
 * Simuler un délai réseau
 * @param {number} ms - Délai en millisecondes
 */
export const delay = (ms = config.mockDelay) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Logger de debug (n'affiche qu'en mode dev)
 */
export const debugLog = (...args) => {
  if (config.debug) {
    console.log("[DEBUG]", ...args);
  }
};

export default config;
