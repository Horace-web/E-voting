import api from "../api/axios";
import API_ROUTES from "../config/api.routes";

const CLOSED_STATUSES = new Set(["Cloturee", "Clôturée", "Terminee", "Terminée", "Closed"]);

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.resultats)) return value.resultats;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};

const normalizeResultRow = (row) => ({
  id: row.id || row.candidat_id || row.candidate_id || row.nom,
  candidat_id: row.candidat_id || row.candidate_id || row.id,
  nom: row.nom || row.name || "Candidat",
  votes: Number(row.voix ?? row.votes ?? 0),
  voix: Number(row.voix ?? row.votes ?? 0),
  pourcentage: Number(row.pourcentage ?? row.percentage ?? 0),
  photo: row.photo || row.photo_url || row.avatar || null,
});

const normalizeElectionResult = (election, rawResult) => {
  const payload = rawResult?.data?.data || rawResult?.data || rawResult || {};
  const rows = toArray(payload).length > 0 ? toArray(payload) : toArray(payload?.data);
  const candidats = rows.map(normalizeResultRow);
  const totalVotes = candidats.reduce((sum, row) => sum + (row.votes || 0), 0);

  return {
    ...election,
    id: String(election.id),
    titre: election.titre || payload?.election?.titre || "Sans titre",
    date_cloture: election.date_cloture || election.date_fin || payload?.election?.date_fin || payload?.date_cloture || "",
    total_electeurs: Number(election.total_electeurs ?? payload?.total_electeurs ?? payload?.election?.total_electeurs ?? 0),
    total_votes: Number(election.total_votes ?? payload?.total_votes ?? totalVotes),
    publie: Boolean(election.publie ?? payload?.publie ?? false),
    candidats,
  };
};

const resultService = {
  getAll: async () => {
    const electionsResponse = await api.get(API_ROUTES.ELECTIONS.LIST);
    const elections = toArray(electionsResponse.data).map((election) => ({
      ...election,
      id: String(election.id),
    }));

    const closedElections = elections.filter((election) => CLOSED_STATUSES.has(election.statut));

    const results = await Promise.all(
      closedElections.map(async (election) => {
        try {
          const response = await api.get(API_ROUTES.RESULTS.GET(election.id));
          return normalizeElectionResult(election, response);
        } catch {
          return normalizeElectionResult(election, null);
        }
      })
    );

    return results;
  },

  getByElection: async (electionId) => {
    const response = await api.get(API_ROUTES.RESULTS.GET(electionId));
    return response.data;
  },

  exportPDF: async (electionId) => {
    const response = await api.get(API_ROUTES.RESULTS.EXPORT_PDF(electionId), {
      responseType: "blob",
    });
    return response.data;
  },

  exportCSV: async (electionId) => {
    const response = await api.get(API_ROUTES.RESULTS.EXPORT_CSV(electionId), {
      responseType: "blob",
    });
    return response.data;
  },
};

export default resultService;
