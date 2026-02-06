/**
 * Configuration centralisée des routes API
 * Ce fichier définit TOUS les endpoints que le backend doit implémenter
 * 
 * Base URL : définie dans .env (VITE_API_URL) ou par défaut http://localhost:8000/api
 */

const API_ROUTES = {
  // ============================================
  // AUTHENTIFICATION
  // ============================================
  AUTH: {
    /**
     * POST /api/auth/login
     * Connexion avec email + mot de passe
     * Body: { email: string, password: string }
     * Response: { success: boolean, token: string, user: Object }
     */
    LOGIN: "/auth/login",

    /**
     * POST /api/auth/logout
     * Déconnexion (invalide le token)
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, message: string }
     */
    LOGOUT: "/auth/logout",

    /**
     * GET /api/auth/confirm/{token}
     * Confirmation d'inscription via token email (48h validité)
     * Params: token (64 caractères)
     * Response: { success: boolean, email: string, password: string, message: string }
     */
    CONFIRM: (token) => `/auth/confirm/${token}`,

    /**
     * POST /api/auth/resend-confirmation
     * Renvoyer le lien de confirmation par email
     * Body: { email: string }
     * Response: { success: boolean, message: string }
     */
    RESEND_CONFIRMATION: "/auth/resend-confirmation",

    /**
     * GET /api/auth/profile
     * Récupérer le profil de l'utilisateur connecté
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, user: Object }
     */
    PROFILE: "/auth/profile",

    /**
     * PUT /api/auth/profile
     * Mettre à jour le profil
     * Headers: Authorization: Bearer {token}
     * Body: { nom?: string, email?: string }
     * Response: { success: boolean, user: Object }
     */
    UPDATE_PROFILE: "/auth/profile",
  },

  // ============================================
  // UTILISATEURS (Admin uniquement)
  // ============================================
  USERS: {
    /**
     * GET /api/users
     * Liste de tous les utilisateurs (avec pagination)
     * Headers: Authorization: Bearer {token} (Admin)
     * Query: ?page=1&limit=20&search=&role=&statut=
     * Response: { success: boolean, data: Array, total: number }
     */
    LIST: "/users",

    /**
     * POST /api/users
     * Créer un nouvel utilisateur
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { email: string, nom: string, prenom: string, role_id: UUID }
     * Response: { success: boolean, user: Object, message: string }
     */
    CREATE: "/users",

    /**
     * GET /api/users/{id}
     * Détails d'un utilisateur
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, user: Object }
     */
    GET: (id) => `/users/${id}`,

    /**
     * PUT /api/users/{id}
     * Mettre à jour un utilisateur
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { nom?: string, email?: string, role_id?: UUID, statut?: string }
     * Response: { success: boolean, user: Object }
     */
    UPDATE: (id) => `/users/${id}`,

    /**
     * DELETE /api/users/{id}
     * Supprimer un utilisateur (soft delete recommandé)
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, message: string }
     */
    DELETE: (id) => `/users/${id}`,
  },

  // ============================================
  // ÉLECTIONS
  // ============================================
  ELECTIONS: {
    /**
     * GET /api/elections
     * Liste des élections (filtrées selon le rôle)
     * Headers: Authorization: Bearer {token}
     * Query: ?statut=&page=1&limit=20
     * Response: { success: boolean, data: Array, total: number }
     */
    LIST: "/elections",

    /**
     * POST /api/elections
     * Créer une nouvelle élection
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { titre: string, description: string, date_ouverture: DateTime, date_cloture: DateTime }
     * Response: { success: boolean, election: Object }
     */
    CREATE: "/elections",

    /**
     * GET /api/elections/{id}
     * Détails d'une élection
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, election: Object }
     */
    GET: (id) => `/elections/${id}`,

    /**
     * PUT /api/elections/{id}
     * Mettre à jour une élection
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { titre?: string, description?: string, date_ouverture?: DateTime, date_cloture?: DateTime }
     * Response: { success: boolean, election: Object }
     */
    UPDATE: (id) => `/elections/${id}`,

    /**
     * DELETE /api/elections/{id}
     * Supprimer une élection (seulement si statut Brouillon)
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, message: string }
     */
    DELETE: (id) => `/elections/${id}`,

    /**
     * POST /api/elections/{id}/publish
     * Publier une élection (Brouillon → Publiée)
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, election: Object }
     */
    PUBLISH: (id) => `/elections/${id}/publish`,

    /**
     * POST /api/elections/{id}/close
     * Clôturer une élection manuellement
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, election: Object }
     */
    CLOSE: (id) => `/elections/${id}/close`,

    /**
     * GET /api/elections/{id}/candidates
     * Liste des candidats d'une élection
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, candidates: Array }
     */
    CANDIDATES: (id) => `/elections/${id}/candidates`,

    /**
     * GET /api/elections/{id}/results
     * Résultats d'une élection (Admin ou si publié)
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, results: Object }
     */
    RESULTS: (id) => `/elections/${id}/results`,

    /**
     * POST /api/elections/{id}/results/publish
     * Publier les résultats (les rendre visibles aux électeurs)
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, message: string }
     */
    PUBLISH_RESULTS: (id) => `/elections/${id}/results/publish`,

    /**
     * GET /api/elections/{id}/statistics
     * Statistiques de participation en temps réel
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, stats: Object }
     */
    STATISTICS: (id) => `/elections/${id}/statistics`,
  },

  // ============================================
  // CANDIDATS
  // ============================================
  CANDIDATES: {
    /**
     * POST /api/elections/{electionId}/candidates
     * Ajouter un candidat à une élection
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { nom: string, photo_url?: string, programme?: string, ordre_affichage?: number }
     * Response: { success: boolean, candidate: Object }
     */
    CREATE: (electionId) => `/elections/${electionId}/candidates`,

    /**
     * GET /api/candidates/{id}
     * Détails d'un candidat
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, candidate: Object }
     */
    GET: (id) => `/candidates/${id}`,

    /**
     * PUT /api/candidates/{id}
     * Mettre à jour un candidat
     * Headers: Authorization: Bearer {token} (Admin)
     * Body: { nom?: string, photo_url?: string, programme?: string, ordre_affichage?: number }
     * Response: { success: boolean, candidate: Object }
     */
    UPDATE: (id) => `/candidates/${id}`,

    /**
     * DELETE /api/candidates/{id}
     * Supprimer un candidat
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, message: string }
     */
    DELETE: (id) => `/candidates/${id}`,
  },

  // ============================================
  // VOTE
  // ============================================
  VOTE: {
    /**
     * GET /api/elections/{id}/ballot
     * Récupérer le bulletin de vote (vérifie droits + déjà voté)
     * Headers: Authorization: Bearer {token} (Électeur)
     * Response: { success: boolean, election: Object, candidates: Array, has_voted: boolean }
     */
    GET_BALLOT: (id) => `/elections/${id}/ballot`,

    /**
     * POST /api/elections/{id}/vote
     * Soumettre un vote
     * Headers: Authorization: Bearer {token} (Électeur)
     * Body: { candidat_id: UUID }
     * Response: { success: boolean, message: string }
     */
    SUBMIT: (id) => `/elections/${id}/vote`,

    /**
     * GET /api/elections/{id}/has-voted
     * Vérifier si l'électeur a déjà voté
     * Headers: Authorization: Bearer {token} (Électeur)
     * Response: { success: boolean, has_voted: boolean }
     */
    HAS_VOTED: (id) => `/elections/${id}/has-voted`,

    /**
     * GET /api/vote/history
     * Historique des participations de l'électeur
     * Headers: Authorization: Bearer {token} (Électeur)
     * Response: { success: boolean, participations: Array }
     */
    HISTORY: "/vote/history",
  },

  // ============================================
  // RÉSULTATS
  // ============================================
  RESULTS: {
    /**
     * GET /api/elections/{id}/results
     * Consulter les résultats d'une élection
     * Headers: Authorization: Bearer {token}
     * Response: { success: boolean, results: Object }
     */
    GET: (id) => `/elections/${id}/results`,

    /**
     * POST /api/elections/{id}/count
     * Déclencher le dépouillement manuel (Admin)
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, results: Object }
     */
    COUNT: (id) => `/elections/${id}/count`,

    /**
     * GET /api/elections/{id}/results/export/pdf
     * Exporter les résultats en PDF
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: Fichier PDF (blob)
     */
    EXPORT_PDF: (id) => `/elections/${id}/results/export/pdf`,

    /**
     * GET /api/elections/{id}/results/export/csv
     * Exporter les résultats en CSV
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: Fichier CSV (blob)
     */
    EXPORT_CSV: (id) => `/elections/${id}/results/export/csv`,
  },

  // ============================================
  // AUDIT
  // ============================================
  AUDIT: {
    /**
     * GET /api/audit/logs
     * Consulter les logs d'audit
     * Headers: Authorization: Bearer {token} (Admin/Auditeur)
     * Query: ?page=1&limit=50&dateDebut=&dateFin=&action=&user_id=&resultat=
     * Response: { success: boolean, logs: Array, total: number }
     */
    LOGS: "/audit/logs",

    /**
     * GET /api/audit/logs/export/csv
     * Exporter les logs en CSV
     * Headers: Authorization: Bearer {token} (Admin/Auditeur)
     * Query: ?dateDebut=&dateFin=&action=&user_id=
     * Response: Fichier CSV (blob)
     */
    EXPORT_CSV: "/audit/logs/export/csv",

    /**
     * GET /api/audit/logs/filter
     * Filtrage avancé des logs
     * Headers: Authorization: Bearer {token} (Admin/Auditeur)
     * Query: ?filters=...
     * Response: { success: boolean, logs: Array }
     */
    FILTER: "/audit/logs/filter",
  },

  // ============================================
  // RÔLES (Référentiel)
  // ============================================
  ROLES: {
    /**
     * GET /api/roles
     * Liste des rôles disponibles
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, roles: Array }
     */
    LIST: "/roles",
  },

  // ============================================
  // STATISTIQUES GLOBALES (Dashboard Admin)
  // ============================================
  STATS: {
    /**
     * GET /api/stats/dashboard
     * Statistiques globales pour le dashboard admin
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, stats: Object }
     */
    DASHBOARD: "/stats/dashboard",

    /**
     * GET /api/stats/participation
     * Statistiques de participation globales
     * Headers: Authorization: Bearer {token} (Admin)
     * Response: { success: boolean, participation: Object }
     */
    PARTICIPATION: "/stats/participation",
  },
};

export default API_ROUTES;
