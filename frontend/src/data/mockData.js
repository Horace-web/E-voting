/**
 * Données mockées pour le développement
 * Ces données seront utilisées quand le backend n'est pas disponible
 */

// ============ UTILISATEURS ============
export const mockUsers = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@universite.fr",
    role: "voter",
    status: "active",
    createdAt: "2025-01-15T10:00:00",
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@universite.fr",
    role: "voter",
    status: "active",
    createdAt: "2025-01-16T14:30:00",
  },
  {
    id: 3,
    firstName: "Admin",
    lastName: "System",
    email: "admin@universite.fr",
    role: "admin",
    status: "active",
    createdAt: "2025-01-01T00:00:00",
  },
  {
    id: 4,
    firstName: "Pierre",
    lastName: "Durand",
    email: "pierre.durand@universite.fr",
    role: "voter",
    status: "inactive",
    createdAt: "2025-01-20T09:15:00",
  },
  {
    id: 5,
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@universite.fr",
    role: "auditor",
    status: "active",
    createdAt: "2025-01-18T11:45:00",
  },
];

// ============ ÉLECTIONS ============
export const mockElections = [
  {
    id: 1,
    title: "Élection du Bureau des Étudiants 2026",
    description:
      "Votez pour élire le nouveau bureau des étudiants qui vous représentera pour l'année 2026.",
    startDate: "2026-02-01T08:00:00",
    endDate: "2026-02-10T18:00:00",
    status: "active",
    totalVoters: 1250,
    totalVotes: 456,
    createdAt: "2026-01-15T10:00:00",
  },
  {
    id: 2,
    title: "Représentants de promotion L3 Info",
    description: "Élisez vos représentants de promotion pour l'année universitaire.",
    startDate: "2026-01-28T08:00:00",
    endDate: "2026-02-05T18:00:00",
    status: "active",
    totalVoters: 220,
    totalVotes: 156,
    createdAt: "2026-01-20T14:00:00",
  },
  {
    id: 3,
    title: "Conseil d'Administration Étudiant",
    description: "Élection des représentants étudiants au conseil d'administration.",
    startDate: "2026-01-15T08:00:00",
    endDate: "2026-01-22T18:00:00",
    status: "closed",
    totalVoters: 950,
    totalVotes: 892,
    createdAt: "2026-01-05T09:00:00",
  },
  {
    id: 4,
    title: "Délégués Master 2 IA",
    description: "Élection des délégués de la promotion Master 2 Intelligence Artificielle.",
    startDate: "2026-02-15T08:00:00",
    endDate: "2026-02-20T18:00:00",
    status: "draft",
    totalVoters: 45,
    totalVotes: 0,
    createdAt: "2026-02-01T16:00:00",
  },
];

// ============ CANDIDATS ============
export const mockCandidates = [
  {
    id: 1,
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@universite.fr",
    photo: null,
    program: "Améliorer la vie étudiante avec plus d'événements culturels et sportifs.",
    party: "Union Étudiante",
    electionId: 1,
    order: 1,
  },
  {
    id: 2,
    firstName: "Lucas",
    lastName: "Dubois",
    email: "lucas.dubois@universite.fr",
    photo: null,
    program: "Défendre les droits des étudiants et améliorer les conditions d'études.",
    party: "Mouvement Étudiant",
    electionId: 1,
    order: 2,
  },
  {
    id: 3,
    firstName: "Emma",
    lastName: "Bernard",
    email: "emma.bernard@universite.fr",
    photo: null,
    program: "Créer plus de partenariats avec les entreprises pour les stages.",
    party: "Avenir Étudiant",
    electionId: 1,
    order: 3,
  },
  {
    id: 4,
    firstName: "Thomas",
    lastName: "Petit",
    email: "thomas.petit@universite.fr",
    photo: null,
    program: "Rendre le campus plus écologique et durable.",
    party: "Étudiants Verts",
    electionId: 1,
    order: 4,
  },
  {
    id: 5,
    firstName: "Julie",
    lastName: "Leroy",
    email: "julie.leroy@universite.fr",
    photo: null,
    program: "Être à l'écoute des étudiants et faire remonter leurs préoccupations.",
    party: null,
    electionId: 2,
    order: 1,
  },
  {
    id: 6,
    firstName: "Antoine",
    lastName: "Moreau",
    email: "antoine.moreau@universite.fr",
    photo: null,
    program: "Organiser des sessions d'entraide et de révision collective.",
    party: null,
    electionId: 2,
    order: 2,
  },
];

// ============ VOTES (historique utilisateur) ============
export const mockVoteHistory = [
  {
    id: 1,
    electionId: 3,
    electionTitle: "Conseil d'Administration Étudiant",
    votedAt: "2026-01-20T14:32:00",
    candidateName: "Marie Laurent",
    candidateParty: "Union Étudiante",
    result: "winner",
  },
  {
    id: 2,
    electionId: 2,
    electionTitle: "Représentants de promotion L3 Info",
    votedAt: "2026-01-30T09:15:00",
    candidateName: "Antoine Moreau",
    candidateParty: null,
    result: "pending",
  },
];

// ============ RÉSULTATS ============
export const mockResults = [
  {
    electionId: 3,
    electionTitle: "Conseil d'Administration Étudiant",
    closedAt: "2026-01-22T18:00:00",
    totalVoters: 950,
    totalVotes: 892,
    participationRate: 93.9,
    published: true,
    candidates: [
      {
        id: 1,
        name: "Marie Laurent",
        party: "Union Étudiante",
        votes: 412,
        percentage: 46.2,
        isWinner: true,
      },
      {
        id: 2,
        name: "Paul Mercier",
        party: "Mouvement Étudiant",
        votes: 298,
        percentage: 33.4,
        isWinner: false,
      },
      {
        id: 3,
        name: "Claire Fontaine",
        party: "Étudiants Verts",
        votes: 182,
        percentage: 20.4,
        isWinner: false,
      },
    ],
  },
];

// ============ JOURNAL D'AUDIT ============
export const mockAuditLogs = [
  {
    id: 1,
    action: "LOGIN",
    userId: 1,
    userName: "Jean Dupont",
    userEmail: "jean.dupont@universite.fr",
    details: "Connexion réussie",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    result: "success",
    createdAt: "2026-02-03T08:30:00",
  },
  {
    id: 2,
    action: "VOTE",
    userId: 1,
    userName: "Jean Dupont",
    userEmail: "jean.dupont@universite.fr",
    details: "Vote enregistré pour l'élection #2",
    ipAddress: "192.168.1.100",
    result: "success",
    createdAt: "2026-02-03T08:35:00",
  },
  {
    id: 3,
    action: "CREATE_ELECTION",
    userId: 3,
    userName: "Admin System",
    userEmail: "admin@universite.fr",
    details: "Création de l'élection 'Délégués Master 2 IA'",
    ipAddress: "192.168.1.1",
    result: "success",
    createdAt: "2026-02-01T16:00:00",
  },
  {
    id: 4,
    action: "LOGIN",
    userId: null,
    userName: "Inconnu",
    userEmail: "hacker@fake.com",
    details: "Tentative de connexion échouée",
    ipAddress: "10.0.0.99",
    result: "failure",
    createdAt: "2026-02-02T23:45:00",
  },
  {
    id: 5,
    action: "PUBLISH_RESULTS",
    userId: 3,
    userName: "Admin System",
    userEmail: "admin@universite.fr",
    details: "Publication des résultats de l'élection #3",
    ipAddress: "192.168.1.1",
    result: "success",
    createdAt: "2026-01-22T18:30:00",
  },
];

// ============ STATISTIQUES DASHBOARD ============
export const mockDashboardStats = {
  admin: {
    totalElections: 12,
    activeElections: 2,
    totalVoters: 2547,
    totalVotes: 1823,
    participationRate: 71.6,
  },
  electeur: {
    availableElections: 2,
    participations: 5,
    nextDeadline: "2026-02-05",
    participationRate: 100,
  },
};

// ============ TYPES D'ACTIONS AUDIT ============
export const auditActionTypes = [
  { value: "LOGIN", label: "Connexion" },
  { value: "LOGOUT", label: "Déconnexion" },
  { value: "VOTE", label: "Vote" },
  { value: "CREATE_ELECTION", label: "Création élection" },
  { value: "UPDATE_ELECTION", label: "Modification élection" },
  { value: "DELETE_ELECTION", label: "Suppression élection" },
  { value: "PUBLISH_ELECTION", label: "Publication élection" },
  { value: "CLOSE_ELECTION", label: "Clôture élection" },
  { value: "PUBLISH_RESULTS", label: "Publication résultats" },
  { value: "CREATE_USER", label: "Création utilisateur" },
  { value: "UPDATE_USER", label: "Modification utilisateur" },
  { value: "DELETE_USER", label: "Suppression utilisateur" },
  { value: "IMPORT_USERS", label: "Import utilisateurs" },
];

export default {
  users: mockUsers,
  elections: mockElections,
  candidates: mockCandidates,
  voteHistory: mockVoteHistory,
  results: mockResults,
  auditLogs: mockAuditLogs,
  dashboardStats: mockDashboardStats,
  auditActionTypes,
};
