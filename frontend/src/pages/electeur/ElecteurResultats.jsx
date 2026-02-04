import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ElecteurLayout from "../../components/ElecteurLayout";
import {
  BarChart3,
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function ElecteurResultats() {
  const { electionId } = useParams();

  // Mock data
  const [elections] = useState([
    {
      id: "1",
      titre: "Élection Présidentielle 2026",
      date_cloture: "2026-01-15T18:00:00",
      total_electeurs: 1250,
      total_votes: 892,
      candidats: [
        {
          id: "1",
          nom: "DOHOU Ercias Audrey",
          votes: 412,
          photo: null,
        },
        {
          id: "2",
          nom: "HOUNDETON Jeffry",
          votes: 298,
          photo: null,
        },
        {
          id: "3",
          nom: "SOGOE Bryan",
          votes: 182,
          photo: null,
        },
      ],
    },
    {
      id: "3",
      titre: "Conseil Étudiant 2026",
      date_cloture: "2026-01-28T20:00:00",
      total_electeurs: 2100,
      total_votes: 1456,
      candidats: [
        {
          id: "7",
          nom: "AKPO Jean",
          votes: 534,
          photo: null,
        },
        {
          id: "8",
          nom: "GBEDO Sarah",
          votes: 489,
          photo: null,
        },
        {
          id: "9",
          nom: "MENSAH David",
          votes: 433,
          photo: null,
        },
      ],
    },
  ]);

  const barColors = [
    "from-[#1e3a5f] to-[#2a4a73]",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-[#f59e0b] to-[#d97706]",
    "from-pink-500 to-pink-600",
  ];

  const getInitials = (nom) => {
    const parts = nom.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
  };

  // Si pas d'electionId, afficher la liste
  if (!electionId) {
    return (
      <ElecteurLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-[#f59e0b] font-medium text-sm">Résultats</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Résultats des élections</h1>
              <p className="text-white/70">Consultez les résultats des élections clôturées</p>
            </div>
          </div>

          {elections.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucun résultat disponible</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Les résultats seront publiés après la clôture des élections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {elections.map((election) => {
                const gagnant = election.candidats.reduce((prev, curr) =>
                  prev.votes > curr.votes ? prev : curr
                );
                const participation = (
                  (election.total_votes / election.total_electeurs) *
                  100
                ).toFixed(1);

                return (
                  <Link
                    key={election.id}
                    to={`/electeur/resultats/${election.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {/* Barre de statut */}
                    <div className="h-1.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706]" />

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#1e3a5f] transition-colors">
                        {election.titre}
                      </h3>

                      {/* Gagnant */}
                      <div className="flex items-center gap-3 mb-5 p-4 bg-gradient-to-r from-[#f59e0b]/10 to-white rounded-xl border border-[#f59e0b]/20">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center">
                          <Trophy className="text-white" size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-[#d97706] font-semibold uppercase tracking-wide">
                            Vainqueur
                          </p>
                          <p className="font-bold text-gray-800">{gagnant.nom}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <TrendingUp size={14} className="text-[#1e3a5f]" />
                          {participation}%
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Users size={14} className="text-[#f59e0b]" />
                          {election.total_votes} votes
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#1e3a5f] font-semibold">
                        <span>Voir les détails</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </ElecteurLayout>
    );
  }

  // Détails d'une élection
  const election = elections.find((e) => e.id === electionId);

  if (!election) {
    return (
      <ElecteurLayout>
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Résultats non disponibles</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Cette élection n'existe pas ou les résultats ne sont pas encore publiés.
          </p>
          <Link
            to="/electeur/resultats"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#152d47] transition-colors"
          >
            <ArrowLeft size={18} />
            Retour aux résultats
          </Link>
        </div>
      </ElecteurLayout>
    );
  }

  const gagnant = election.candidats.reduce((prev, curr) =>
    prev.votes > curr.votes ? prev : curr
  );
  const tauxParticipation = ((election.total_votes / election.total_electeurs) * 100).toFixed(1);
  const totalVotes = election.total_votes;

  return (
    <ElecteurLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/electeur/resultats"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#1e3a5f] hover:border-[#1e3a5f] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{election.titre}</h1>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
              <Calendar size={16} />
              Clôturé le{" "}
              {new Date(election.date_cloture).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1e3a5f] to-[#2a4a73]"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center">
                <Users className="text-[#1e3a5f]" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Électeurs inscrits</p>
                <p className="text-2xl font-bold text-[#1e3a5f]">
                  {election.total_electeurs.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Votes exprimés</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {election.total_votes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-violet-600"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500/10 to-violet-500/5 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-violet-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Taux de participation</p>
                <p className="text-2xl font-bold text-violet-600">{tauxParticipation}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gagnant */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#f59e0b] rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm border border-white/30">
              {getInitials(gagnant.nom)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={24} />
                <span className="text-white/80 font-semibold uppercase tracking-wide text-sm">
                  Vainqueur de l'élection
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-1">{gagnant.nom}</h2>
              <p className="text-white/80 text-lg">
                <span className="font-bold text-white">{gagnant.votes}</span> votes •{" "}
                <span className="font-bold text-white">
                  {((gagnant.votes / totalVotes) * 100).toFixed(1)}%
                </span>{" "}
                des suffrages
              </p>
            </div>
          </div>
        </div>

        {/* Résultats détaillés */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-[#1e3a5f]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Détail des résultats</h2>
          </div>

          <div className="space-y-6">
            {election.candidats
              .sort((a, b) => b.votes - a.votes)
              .map((candidat, index) => {
                const pourcentage = ((candidat.votes / totalVotes) * 100).toFixed(1);
                const isWinner = candidat.id === gagnant.id;

                return (
                  <div key={candidat.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-lg font-bold w-8 h-8 rounded-lg flex items-center justify-center ${
                            isWinner
                              ? "bg-[#f59e0b]/10 text-[#d97706]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                            isWinner
                              ? "bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white shadow-lg"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {getInitials(candidat.nom)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 flex items-center gap-2">
                            {candidat.nom}
                            {isWinner && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#f59e0b]/10 text-[#d97706] rounded-full text-xs font-semibold">
                                <Trophy size={12} /> Élu
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-bold ${isWinner ? "text-[#d97706]" : "text-gray-800"}`}
                        >
                          {pourcentage}%
                        </span>
                        <span className="text-sm text-gray-500 block">
                          {candidat.votes.toLocaleString()} votes
                        </span>
                      </div>
                    </div>

                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${barColors[index % barColors.length]} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pourcentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </ElecteurLayout>
  );
}

export default ElecteurResultats;
