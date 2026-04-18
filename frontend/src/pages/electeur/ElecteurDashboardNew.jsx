import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ElecteurLayout from "../../components/ElecteurLayout";
import {
  Vote,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Bell,
  Sparkles,
} from "lucide-react";
import electionService from "../../services/election.service";
import config from "../../config/app.config";
import { normalizeApiResponse } from "../../utils/api-utils";

const MOCK_ELECTIONS = [
  {
    id: "1",
    titre: "Election du Bureau des Etudiants 2026",
    dateDebut: "2026-03-20",
    dateFin: "2026-03-25",
    candidats: 4,
    votants: 156,
    hasVoted: false,
    statut: "EnCours",
  },
  {
    id: "2",
    titre: "Representants de promotion L3 Info",
    dateDebut: "2026-03-10",
    dateFin: "2026-03-17",
    candidats: 3,
    votants: 45,
    hasVoted: true,
    statut: "Publiée",
  },
];

const normalizeElection = (e) => ({
  id: String(e.id),
  titre: e.titre || "Sans titre",
  dateDebut: e.date_debut || e.dateDebut || "",
  dateFin: e.date_fin || e.dateFin || "",
  candidats: e.nb_candidats || e.candidats || 0,
  votants: e.nb_votants || e.total_votes || e.votants || 0,
  hasVoted: Boolean(e.a_vote ?? e.has_voted ?? e.hasVoted ?? false),
  statut: e.statut || "Brouillon",
});

const isOpenElection = (statut) => ["EnCours", "En cours", "Publiée", "Publiee"].includes(statut);

const ElecteurDashboardNew = () => {
  const [electionsEnCours, setElectionsEnCours] = useState([]);

  const [notifications] = useState([
    {
      id: 1,
      type: "new",
      message: "Consultez les elections ouvertes et votez avant la date limite.",
      date: "Aujourd'hui",
    },
    {
      id: 2,
      type: "reminder",
      message: "Le vote est definitif apres confirmation.",
      date: "Rappel",
    },
  ]);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const response = await electionService.getAll();
        const list = normalizeApiResponse(response);
        const mapped = list.map(normalizeElection).filter((e) => isOpenElection(e.statut));
        setElectionsEnCours(mapped);
      } catch (error) {
        console.error("Erreur chargement dashboard electeur:", error);
        setElectionsEnCours([]);
      }
    };

    loadElections();
  }, []);

  const stats = useMemo(() => {
    const electionsActives = electionsEnCours.length;
    const participations = electionsEnCours.filter((e) => e.hasVoted).length;

    const sorted = [...electionsEnCours]
      .filter((e) => e.dateFin)
      .sort((a, b) => new Date(a.dateFin) - new Date(b.dateFin));

    const prochaine = sorted[0]?.titre || "Aucune election";
    const prochaineDate = sorted[0]?.dateFin
      ? new Date(sorted[0].dateFin).toLocaleDateString("fr-FR")
      : "-";

    return {
      electionsActives,
      participations,
      prochaine,
      prochaineDate,
    };
  }, [electionsEnCours]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date non definie";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeRemaining = (dateFin) => {
    if (!dateFin) return "Date non definie";
    const now = new Date();
    const end = new Date(dateFin);
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Terminee";
    if (days === 1) return "1 jour restant";
    return `${days} jours restants`;
  };

  return (
    <ElecteurLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[#f59e0b] font-medium text-sm">Espace Electeur</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre espace de vote</h1>
            <p className="text-white/70 max-w-xl">
              Participez aux elections de votre etablissement en toute securite.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Elections actives</p>
            <p className="text-4xl font-bold text-[#1e3a5f] mt-2">{stats.electionsActives}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Mes participations</p>
            <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.participations}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Prochaine echeance</p>
            <p className="text-2xl font-bold text-[#d97706] mt-2">{stats.prochaineDate}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{stats.prochaine}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">Taux de participation</p>
            <p className="text-4xl font-bold text-violet-600 mt-2">
              {stats.electionsActives > 0
                ? `${Math.round((stats.participations / stats.electionsActives) * 100)}%`
                : "0%"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
                      <Vote className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Elections ouvertes</h2>
                  </div>
                  <Link
                    to="/electeur/vote"
                    className="text-[#1e3a5f] hover:text-[#f59e0b] text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    Voir toutes <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {electionsEnCours.map((election) => (
                  <div
                    key={election.id}
                    className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      election.hasVoted
                        ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-white"
                        : "border-[#1e3a5f]/20 bg-gradient-to-r from-[#1e3a5f]/5 to-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{election.titre}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Du {formatDate(election.dateDebut)} au {formatDate(election.dateFin)}
                        </p>
                      </div>
                      {election.hasVoted ? (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Vote
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-[#f59e0b]/10 text-[#d97706] rounded-full text-sm font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4" /> {getTimeRemaining(election.dateFin)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Users className="w-4 h-4 text-[#1e3a5f]" />
                          <span className="font-medium">{election.candidats}</span> candidats
                        </span>
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Award className="w-4 h-4 text-[#f59e0b]" />
                          <span className="font-medium">{election.votants}</span> votes
                        </span>
                      </div>
                      {!election.hasVoted && (
                        <Link
                          to={`/electeur/vote/${election.id}`}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-xl text-sm font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all"
                        >
                          Voter
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {electionsEnCours.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="font-medium">Aucune election ouverte pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#f59e0b] mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">Rappel</h3>
                  <p className="text-sm text-white/80">Un vote confirme est definitif et securise.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElecteurLayout>
  );
};

export default ElecteurDashboardNew;
