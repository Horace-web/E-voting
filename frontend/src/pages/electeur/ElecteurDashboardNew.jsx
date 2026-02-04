import { useState, useEffect } from "react";
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
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import electionService from "../../services/election.service";
import voteService from "../../services/vote.service";
import config from "../../config/app.config";

const ElecteurDashboardNew = () => {
  // Données simulées
  const [stats] = useState({
    electionsActives: 2,
    participations: 5,
    prochaine: "Élection du BDE 2026",
    prochaineDate: "15 Fév 2026",
  });

  const [electionsEnCours] = useState([
    {
      id: 1,
      titre: "Élection du Bureau des Étudiants 2026",
      dateDebut: "2026-02-01",
      dateFin: "2026-02-10",
      candidats: 4,
      votants: 156,
      hasVoted: false,
    },
    {
      id: 2,
      titre: "Représentants de promotion L3 Info",
      dateDebut: "2026-01-28",
      dateFin: "2026-02-05",
      candidats: 3,
      votants: 45,
      hasVoted: true,
    },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: "new",
      message: "Nouvelle élection disponible : Élection du BDE 2026",
      date: "Il y a 2 heures",
    },
    {
      id: 2,
      type: "reminder",
      message: "N'oubliez pas de voter pour les représentants L3",
      date: "Hier",
    },
    {
      id: 3,
      type: "result",
      message: "Les résultats de l'élection CSE sont disponibles",
      date: "Il y a 3 jours",
    },
  ]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeRemaining = (dateFin) => {
    const now = new Date();
    const end = new Date(dateFin);
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Terminée";
    if (days === 1) return "1 jour restant";
    return `${days} jours restants`;
  };

  return (
    <ElecteurLayout>
      <div className="space-y-8">
        {/* Bannière de bienvenue */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[#f59e0b] font-medium text-sm">Espace Électeur</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre espace de vote</h1>
            <p className="text-white/70 max-w-xl">
              Participez aux élections de votre établissement en toute sécurité. Votre vote est
              anonyme et chiffré.
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 - Élections actives */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1e3a5f] to-[#2a4a73]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Élections actives</p>
                <p className="text-4xl font-bold text-[#1e3a5f] mt-2">{stats.electionsActives}</p>
                <p className="text-xs text-gray-400 mt-1">En ce moment</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Vote className="w-7 h-7 text-[#1e3a5f]" />
              </div>
            </div>
          </div>

          {/* Stat 2 - Participations */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Mes participations</p>
                <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.participations}</p>
                <p className="text-xs text-gray-400 mt-1">Votes effectués</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Stat 3 - Prochaine échéance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#f59e0b] to-[#d97706]"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Prochaine échéance</p>
                <p className="text-2xl font-bold text-[#d97706] mt-2">{stats.prochaineDate}</p>
                <p className="text-xs text-gray-400 mt-1">{stats.prochaine}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-[#d97706]" />
              </div>
            </div>
          </div>

          {/* Stat 4 - Taux participation */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-violet-600"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Taux de participation</p>
                <p className="text-4xl font-bold text-violet-600 mt-2">100%</p>
                <p className="text-xs text-gray-400 mt-1">Excellent !</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500/10 to-violet-500/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Élections en cours */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
                      <Vote className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Élections en cours</h2>
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
                        : "border-[#1e3a5f]/20 bg-gradient-to-r from-[#1e3a5f]/5 to-white hover:border-[#f59e0b]/50"
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
                          <CheckCircle className="w-4 h-4" /> Voté
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
                          className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-xl text-sm font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          Voter maintenant
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {electionsEnCours.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Vote className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium">Aucune élection en cours pour le moment</p>
                    <p className="text-sm text-gray-400 mt-1">Revenez bientôt !</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                  <span className="ml-auto bg-[#f59e0b] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-[#1e3a5f]/5 transition-colors cursor-pointer border border-transparent hover:border-[#1e3a5f]/10"
                  >
                    <p className="text-sm text-gray-700 font-medium">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  Actions rapides
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/electeur/vote"
                    className="flex items-center gap-3 p-3.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group"
                  >
                    <div className="w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Vote className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Voter maintenant</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    to="/electeur/resultats"
                    className="flex items-center gap-3 p-3.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group"
                  >
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Voir les résultats</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    to="/electeur/participations"
                    className="flex items-center gap-3 p-3.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group"
                  >
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Mes participations</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Badge sécurité */}
            <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-emerald-800">Vote sécurisé</p>
                  <p className="text-sm text-emerald-600">Chiffrement de bout en bout</p>
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
