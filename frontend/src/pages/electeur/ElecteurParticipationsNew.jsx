import { useState } from "react";
import { Link } from "react-router-dom";
import ElecteurLayout from "../../components/ElecteurLayout";
import {
  CheckCircle,
  Calendar,
  Vote,
  Download,
  Eye,
  Search,
  Filter,
  Award,
  Clock,
  History,
  Trophy,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const ElecteurParticipationsNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");

  const [participations] = useState([
    {
      id: 1,
      electionId: 10,
      electionTitre: "Élection du Bureau des Étudiants 2026",
      dateVote: "2026-01-15T14:32:00",
      candidatVote: {
        nom: "Martin",
        prenom: "Sophie",
        parti: "Union Étudiante",
      },
      resultat: "gagnant",
      annee: 2026,
    },
    {
      id: 2,
      electionId: 11,
      electionTitre: "Représentants de promotion L3 Info",
      dateVote: "2026-01-20T09:15:00",
      candidatVote: {
        nom: "Dubois",
        prenom: "Lucas",
        parti: null,
      },
      resultat: "perdant",
      annee: 2026,
    },
    {
      id: 3,
      electionId: 12,
      electionTitre: "Élection du Conseil d'Administration",
      dateVote: "2025-12-10T16:45:00",
      candidatVote: {
        nom: "Bernard",
        prenom: "Emma",
        parti: "Mouvement Étudiant",
      },
      resultat: "gagnant",
      annee: 2025,
    },
    {
      id: 4,
      electionId: 8,
      electionTitre: "Élection du Bureau des Étudiants 2025",
      dateVote: "2025-03-12T11:20:00",
      candidatVote: {
        nom: "Petit",
        prenom: "Thomas",
        parti: "Étudiants Verts",
      },
      resultat: "perdant",
      annee: 2025,
    },
    {
      id: 5,
      electionId: 9,
      electionTitre: "Représentants de promotion L2 Info",
      dateVote: "2025-02-08T10:00:00",
      candidatVote: {
        nom: "Leroy",
        prenom: "Julie",
        parti: null,
      },
      resultat: "gagnant",
      annee: 2025,
    },
  ]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ""}${nom?.charAt(0) || ""}`.toUpperCase();
  };

  const years = [...new Set(participations.map((p) => p.annee))].sort((a, b) => b - a);

  const filteredParticipations = participations.filter((p) => {
    const matchSearch = p.electionTitre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = filterYear === "all" || p.annee === parseInt(filterYear);
    return matchSearch && matchYear;
  });

  const stats = {
    total: participations.length,
    gagnants: participations.filter((p) => p.resultat === "gagnant").length,
    tauxReussite: Math.round(
      (participations.filter((p) => p.resultat === "gagnant").length / participations.length) * 100
    ),
  };

  return (
    <ElecteurLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[#f59e0b] font-medium text-sm">Historique</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Mes participations</h1>
            <p className="text-white/70">
              Consultez l'historique de toutes vos participations aux élections
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1e3a5f] to-[#2a4a73]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total participations</p>
                <p className="text-4xl font-bold text-[#1e3a5f] mt-2">{stats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Élections votées</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Vote className="w-7 h-7 text-[#1e3a5f]" />
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#f59e0b] to-[#d97706]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Candidats élus</p>
                <p className="text-4xl font-bold text-[#d97706] mt-2">{stats.gagnants}</p>
                <p className="text-xs text-gray-400 mt-1">Votes gagnants</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-[#d97706]" />
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Taux de réussite</p>
                <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.tauxReussite}%</p>
                <p className="text-xs text-gray-400 mt-1">Excellent score !</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une élection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                >
                  <option value="all">Toutes les années</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#152d47] transition-colors">
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des participations */}
        <div className="space-y-4">
          {filteredParticipations.map((participation) => (
            <div
              key={participation.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div
                className={`h-1.5 ${
                  participation.resultat === "gagnant"
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                    : "bg-gradient-to-r from-gray-300 to-gray-400"
                }`}
              />
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Info principale */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          participation.resultat === "gagnant"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#1e3a5f] transition-colors">
                          {participation.electionTitre}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-[#1e3a5f]" />
                            {formatDate(participation.dateVote)}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4 text-[#f59e0b]" />
                            {formatTime(participation.dateVote)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidat voté + actions */}
                  <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
                    {/* Candidat voté */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white rounded-xl px-4 py-3 border border-gray-100">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          participation.resultat === "gagnant"
                            ? "bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {getInitials(
                          participation.candidatVote.prenom,
                          participation.candidatVote.nom
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {participation.candidatVote.prenom} {participation.candidatVote.nom}
                        </p>
                        {participation.candidatVote.parti && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {participation.candidatVote.parti}
                          </p>
                        )}
                      </div>
                      {participation.resultat === "gagnant" && (
                        <Trophy className="w-5 h-5 text-[#f59e0b] ml-1" />
                      )}
                    </div>

                    {/* Statut */}
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        participation.resultat === "gagnant"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {participation.resultat === "gagnant" ? "✓ Élu" : "Non élu"}
                    </span>

                    {/* Action */}
                    <Link
                      to={`/electeur/resultats/${participation.electionId}`}
                      className="p-3 bg-[#1e3a5f]/5 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-xl transition-all"
                      title="Voir les résultats"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredParticipations.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Aucune participation trouvée
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || filterYear !== "all"
                  ? "Aucun résultat ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore participé à une élection."}
              </p>
            </div>
          )}
        </div>

        {/* Note de confidentialité */}
        <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-white rounded-2xl p-6 border border-[#1e3a5f]/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#1e3a5f]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1e3a5f] mb-1">Confidentialité garantie</h4>
              <p className="text-sm text-gray-600">
                Le contenu de votre vote reste strictement confidentiel. Seule l'information de
                votre participation est enregistrée dans cet historique, conformément aux règles de
                vote anonyme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ElecteurLayout>
  );
};

export default ElecteurParticipationsNew;
