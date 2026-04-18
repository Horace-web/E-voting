import { useEffect, useMemo, useState } from "react";
import ElecteurLayout from "../../components/ElecteurLayout";
import { CheckCircle, Search, Filter, History, Vote, TrendingUp } from "lucide-react";
import voteService from "../../services/vote.service";

const getYear = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
};

const ElecteurParticipationsNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [participations, setParticipations] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const response = await voteService.getHistory();
        const list = Array.isArray(response) ? response : response?.data || response?.participations || [];

        const mapped = list.map((p, idx) => ({
          id: p.id || idx + 1,
          electionTitre: p.election_titre || p.titre || `Election ${idx + 1}`,
          dateVote: p.date_vote || p.created_at || new Date().toISOString(),
          annee: getYear(p.date_vote || p.created_at) || new Date().getFullYear(),
          resultat: p.resultat || "indetermine",
        }));

        setParticipations(mapped);
      } catch (error) {
        console.error("Erreur chargement historique votes:", error);
        setParticipations([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const years = useMemo(
    () => [...new Set(participations.map((p) => p.annee).filter(Boolean))].sort((a, b) => b - a),
    [participations]
  );

  const filteredParticipations = useMemo(() => {
    return participations.filter((p) => {
      const matchSearch = p.electionTitre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchYear = filterYear === "all" || p.annee === Number(filterYear);
      return matchSearch && matchYear;
    });
  }, [participations, searchTerm, filterYear]);

  const stats = {
    total: participations.length,
    valides: participations.filter((p) => p.resultat === "gagnant").length,
  };

  return (
    <ElecteurLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[#f59e0b] font-medium text-sm">Historique</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Mes participations</h1>
            <p className="text-white/70">Historique de vos votes en election</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total participations</p>
            <p className="text-4xl font-bold text-[#1e3a5f] mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Votes gagnants</p>
            <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.valides}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une election..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
              >
                <option value="all">Toutes les annees</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
              Chargement...
            </div>
          )}

          {!loading && filteredParticipations.length === 0 && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center text-gray-500">
              Aucune participation trouvee.
            </div>
          )}

          {!loading &&
            filteredParticipations.map((participation) => (
              <div
                key={participation.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{participation.electionTitre}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Vote le {new Date(participation.dateVote).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    participation.resultat === "gagnant"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {participation.resultat === "gagnant" ? (
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Gagnant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Vote enregistre
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </ElecteurLayout>
  );
};

export default ElecteurParticipationsNew;
