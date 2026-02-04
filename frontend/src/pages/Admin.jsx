import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../auth/AuthContext";
import {
  Users,
  Vote,
  CheckCircle,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Zap,
  Eye,
  Plus,
  ChevronRight,
  UserCheck,
  FileCheck,
} from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab] = useState("dashboard");

  // Utilisateur par défaut pour le développement
  const currentUser = user || {
    firstName: "Admin",
    lastName: "System",
  };

  // Mock data - sera remplacé par les vraies données du backend
  const stats = {
    totalElections: 12,
    activeElections: 3,
    totalVoters: 2547,
    totalVotes: 1823,
    participationRate: 71.6,
    pendingValidations: 5,
  };

  const recentElections = [
    {
      id: 1,
      title: "Élection du Délégué de Classe L3 Info",
      status: "En cours",
      startDate: "2026-01-28",
      endDate: "2026-02-05",
      votes: 156,
      totalVoters: 220,
    },
    {
      id: 2,
      title: "Bureau des Étudiants 2026",
      status: "Publiée",
      startDate: "2026-02-10",
      endDate: "2026-02-15",
      votes: 0,
      totalVoters: 1200,
    },
    {
      id: 3,
      title: "Représentant Étudiant Conseil",
      status: "Clôturée",
      startDate: "2026-01-15",
      endDate: "2026-01-22",
      votes: 892,
      totalVoters: 950,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Jean Dupont",
      action: "a voté à l'élection",
      target: "Délégué de Classe L3 Info",
      time: "Il y a 5 minutes",
      type: "vote",
    },
    {
      id: 2,
      user: "Admin",
      action: "a publié l'élection",
      target: "Bureau des Étudiants 2026",
      time: "Il y a 2 heures",
      type: "admin",
    },
    {
      id: 3,
      user: "Marie Martin",
      action: "a voté à l'élection",
      target: "Délégué de Classe L3 Info",
      time: "Il y a 3 heures",
      type: "vote",
    },
    {
      id: 4,
      user: "Admin",
      action: "a clôturé l'élection",
      target: "Représentant Étudiant Conseil",
      time: "Il y a 5 heures",
      type: "admin",
    },
    {
      id: 5,
      user: "Pierre Lefebvre",
      action: "s'est inscrit",
      target: "Nouveau compte électeur",
      time: "Il y a 6 heures",
      type: "user",
    },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "En cours":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          glow: "shadow-emerald-100",
        };
      case "Publiée":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          glow: "shadow-blue-100",
        };
      case "Clôturée":
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "bg-gray-400",
          glow: "shadow-gray-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "bg-gray-400",
          glow: "shadow-gray-100",
        };
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "vote":
        return { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600" };
      case "admin":
        return { icon: Shield, bg: "bg-[#1e3a5f]/10", color: "text-[#1e3a5f]" };
      case "user":
        return { icon: UserCheck, bg: "bg-amber-100", color: "text-amber-600" };
      default:
        return { icon: Activity, bg: "bg-gray-100", color: "text-gray-600" };
    }
  };

  return (
    <AdminLayout activeTab={activeTab}>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f2744] via-[#1e3a5f] to-[#2a4a73] rounded-2xl p-8 mb-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f59e0b] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold rounded-full border border-[#f59e0b]/30">
                Administration
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Système opérationnel
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Bonjour, {currentUser.firstName} !!
            </h1>
            <p className="text-white/70 max-w-lg">
              Bienvenue dans votre espace d'administration. Gérez les élections, supervisez les
              votes et consultez les statistiques en temps réel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/elections"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
            >
              <Plus size={18} />
              <span>Nouvelle élection</span>
            </Link>
            <Link
              to="/admin/audit"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
            >
              <Eye size={18} />
              <span>Journal d'audit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Elections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-[#1e3a5f]/20 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-xl flex items-center justify-center shadow-lg shadow-[#1e3a5f]/20 group-hover:scale-110 transition-transform">
                <Vote className="text-white" size={26} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight size={14} />
                <span className="text-xs font-semibold">+2</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalElections}</h3>
            <p className="text-sm text-gray-500 font-medium">Élections totales</p>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73]" />
        </div>

        {/* Active Elections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Clock className="text-white" size={26} />
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold">Actif</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeElections}</h3>
            <p className="text-sm text-gray-500 font-medium">Élections en cours</p>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400" />
        </div>

        {/* Total Voters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-purple-200 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <Users className="text-white" size={26} />
              </div>
              <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight size={14} />
                <span className="text-xs font-semibold">+48</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalVoters.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 font-medium">Électeurs inscrits</p>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-400" />
        </div>

        {/* Participation Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-amber-200 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-white" size={26} />
              </div>
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight size={14} />
                <span className="text-xs font-semibold">+5.2%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.participationRate}%</h3>
            <p className="text-sm text-gray-500 font-medium">Taux de participation</p>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Elections */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
                  <Vote className="text-[#1e3a5f]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Élections récentes</h2>
                  <p className="text-sm text-gray-500">Suivi des scrutins en temps réel</p>
                </div>
              </div>
              <Link
                to="/admin/elections"
                className="flex items-center gap-1 text-sm font-semibold text-[#1e3a5f] hover:text-[#f59e0b] transition-colors group"
              >
                Voir tout
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentElections.map((election) => {
              const statusConfig = getStatusConfig(election.status);
              const progress = (election.votes / election.totalVoters) * 100;

              return (
                <div key={election.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1e3a5f] transition-colors">
                        {election.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(election.startDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          -{" "}
                          {new Date(election.endDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${election.status === "En cours" ? "animate-pulse" : ""}`}
                      ></span>
                      {election.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <span className="text-sm font-bold text-gray-800">{election.votes}</span>
                      <span className="text-sm text-gray-400">/{election.totalVoters}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {Math.round(progress)}% de participation
                    </span>
                    <Link
                      to={`/admin/elections/${election.id}`}
                      className="text-xs font-medium text-[#1e3a5f] hover:text-[#f59e0b] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Activity className="text-amber-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Activité récente</h2>
                <p className="text-sm text-gray-500">Dernières actions</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {recentActivities.map((activity) => {
              const iconConfig = getActivityIcon(activity.type);
              const IconComponent = iconConfig.icon;

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${iconConfig.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <IconComponent className={iconConfig.color} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-gray-600">{activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-500 truncate font-medium">{activity.target}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Link
              to="/admin/audit"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#1e3a5f] hover:text-[#f59e0b] transition-colors"
            >
              Voir tout l'historique
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap size={16} className="text-amber-500" />
            Accès direct aux fonctionnalités
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/elections"
            className="group relative bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Vote size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Créer une élection</h3>
              <p className="text-sm text-white/70">Lancez un nouveau scrutin électronique</p>
            </div>
            <ChevronRight
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              size={24}
            />
          </Link>

          <Link
            to="/admin/utilisateurs"
            className="group relative bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Gérer les utilisateurs</h3>
              <p className="text-sm text-white/70">Ajouter et gérer les électeurs</p>
            </div>
            <ChevronRight
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              size={24}
            />
          </Link>

          <Link
            to="/admin/resultats"
            className="group relative bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Voir les résultats</h3>
              <p className="text-sm text-white/70">Consultez les statistiques détaillées</p>
            </div>
            <ChevronRight
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              size={24}
            />
          </Link>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Shield className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Système sécurisé et opérationnel</h3>
              <p className="text-sm text-gray-500">Dernière vérification : il y a 2 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">API connectée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">Base de données</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">Chiffrement actif</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
