import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Vote,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import auditService from "../../services/audit.service";
import config from "../../config/app.config";
import "../../pages/Admin.css";

function Audit() {
  // Mock data pour les logs d'audit
  const [logs] = useState([
    {
      id: "1",
      action_type: "LOGIN",
      description: "Connexion réussie",
      user_name: "ODOUNLAMI Horace",
      user_email: "horace.odounlami@universite.bj",
      user_role: "admin",
      ip_address: "192.168.1.45",
      resultat: "SUCCESS",
      created_at: "2026-02-03T08:15:32",
    },
    {
      id: "2",
      action_type: "CREATE_ELECTION",
      description: 'Création de l\'élection "Bureau BDE 2026"',
      user_name: "ODOUNLAMI Horace",
      user_email: "horace.odounlami@universite.bj",
      user_role: "admin",
      ip_address: "192.168.1.45",
      resultat: "SUCCESS",
      created_at: "2026-02-03T08:22:15",
    },
    {
      id: "3",
      action_type: "VOTE",
      description: 'Vote enregistré pour "Élection Présidentielle 2026"',
      user_name: "DOHOU Ercias Audrey",
      user_email: "ercias.dohou@universite.bj",
      user_role: "voter",
      ip_address: "192.168.1.102",
      resultat: "SUCCESS",
      created_at: "2026-02-02T14:35:48",
    },
    {
      id: "4",
      action_type: "VOTE",
      description: 'Vote enregistré pour "Élection Présidentielle 2026"',
      user_name: "HOUNDETON Jeffry",
      user_email: "jeffry.houndeton@universite.bj",
      user_role: "voter",
      ip_address: "192.168.1.87",
      resultat: "SUCCESS",
      created_at: "2026-02-02T15:12:23",
    },
    {
      id: "5",
      action_type: "LOGIN_FAILED",
      description: "Tentative de connexion échouée - Code OTP invalide",
      user_name: "Inconnu",
      user_email: "test@universite.bj",
      user_role: "unknown",
      ip_address: "192.168.1.201",
      resultat: "FAILURE",
      created_at: "2026-02-02T16:45:00",
    },
    {
      id: "6",
      action_type: "PUBLISH_ELECTION",
      description: 'Publication de l\'élection "Conseil Étudiant 2026"',
      user_name: "ODOUNLAMI Horace",
      user_email: "horace.odounlami@universite.bj",
      user_role: "admin",
      ip_address: "192.168.1.45",
      resultat: "SUCCESS",
      created_at: "2026-02-02T10:30:00",
    },
    {
      id: "7",
      action_type: "CLOSE_ELECTION",
      description: 'Clôture de l\'élection "Élection des Représentants"',
      user_name: "ODOUNLAMI Horace",
      user_email: "horace.odounlami@universite.bj",
      user_role: "admin",
      ip_address: "192.168.1.45",
      resultat: "SUCCESS",
      created_at: "2026-01-28T18:00:05",
    },
    {
      id: "8",
      action_type: "EXPORT_RESULTS",
      description: 'Export PDF des résultats "Élection Présidentielle 2025"',
      user_name: "ADJOVI Marie",
      user_email: "marie.adjovi@universite.bj",
      user_role: "auditor",
      ip_address: "192.168.1.156",
      resultat: "SUCCESS",
      created_at: "2026-01-25T11:20:33",
    },
    {
      id: "9",
      action_type: "UPDATE_USER",
      description: 'Modification du statut utilisateur "KOUASSI Paul" → Inactif',
      user_name: "ODOUNLAMI Horace",
      user_email: "horace.odounlami@universite.bj",
      user_role: "admin",
      ip_address: "192.168.1.45",
      resultat: "SUCCESS",
      created_at: "2026-01-22T09:45:12",
    },
    {
      id: "10",
      action_type: "LOGOUT",
      description: "Déconnexion",
      user_name: "SOGOE Bryan",
      user_email: "bryan.sogoe@universite.bj",
      user_role: "voter",
      ip_address: "192.168.1.78",
      resultat: "SUCCESS",
      created_at: "2026-01-21T17:30:00",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtreAction, setFiltreAction] = useState("all");
  const [filtreResultat, setFiltreResultat] = useState("all");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // Types d'actions
  const actionTypes = [
    { value: "LOGIN", label: "Connexion", icon: LogIn, color: "text-green-600 bg-green-50" },
    { value: "LOGOUT", label: "Déconnexion", icon: LogOut, color: "text-gray-600 bg-gray-50" },
    {
      value: "LOGIN_FAILED",
      label: "Échec connexion",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
    },
    { value: "VOTE", label: "Vote", icon: Vote, color: "text-blue-600 bg-blue-50" },
    {
      value: "CREATE_ELECTION",
      label: "Création élection",
      icon: Edit,
      color: "text-purple-600 bg-purple-50",
    },
    {
      value: "PUBLISH_ELECTION",
      label: "Publication élection",
      icon: Eye,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      value: "CLOSE_ELECTION",
      label: "Clôture élection",
      icon: CheckCircle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      value: "UPDATE_USER",
      label: "Modification utilisateur",
      icon: User,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      value: "EXPORT_RESULTS",
      label: "Export résultats",
      icon: Download,
      color: "text-pink-600 bg-pink-50",
    },
    { value: "DELETE", label: "Suppression", icon: Trash2, color: "text-red-600 bg-red-50" },
  ];

  // Filtrage des logs
  const logsFiltres = logs.filter((log) => {
    const matchSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address.includes(searchTerm);
    const matchAction = filtreAction === "all" || log.action_type === filtreAction;
    const matchResultat = filtreResultat === "all" || log.resultat === filtreResultat;

    let matchDate = true;
    if (dateDebut) {
      matchDate = matchDate && new Date(log.created_at) >= new Date(dateDebut);
    }
    if (dateFin) {
      matchDate = matchDate && new Date(log.created_at) <= new Date(dateFin + "T23:59:59");
    }

    return matchSearch && matchAction && matchResultat && matchDate;
  });

  // Statistiques
  const stats = {
    total: logs.length,
    succes: logs.filter((l) => l.resultat === "SUCCESS").length,
    echecs: logs.filter((l) => l.resultat === "FAILURE").length,
    votes: logs.filter((l) => l.action_type === "VOTE").length,
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Date",
      "Heure",
      "Action",
      "Description",
      "Utilisateur",
      "Email",
      "Rôle",
      "IP",
      "Résultat",
    ];
    const rows = logsFiltres.map((log) => {
      const date = new Date(log.created_at);
      return [
        date.toLocaleDateString("fr-FR"),
        date.toLocaleTimeString("fr-FR"),
        getActionInfo(log.action_type).label,
        log.description,
        log.user_name,
        log.user_email,
        log.user_role,
        log.ip_address,
        log.resultat,
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getActionInfo = (actionType) => {
    return (
      actionTypes.find((a) => a.value === actionType) || {
        label: actionType,
        icon: ClipboardList,
        color: "text-gray-600 bg-gray-50",
      }
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("fr-FR"),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFiltreAction("all");
    setFiltreResultat("all");
    setDateDebut("");
    setDateFin("");
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Journal d'Audit</h1>
            <p className="text-gray-600">Traçabilité complète des actions sur la plateforme</p>
          </div>
          <button onClick={exportCSV} className="btn-primary flex items-center gap-2">
            <Download size={20} />
            Exporter CSV
          </button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-label">Total actions</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Réussies</div>
            <div className="stat-value text-green-600">{stats.succes}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Échouées</div>
            <div className="stat-value text-red-600">{stats.echecs}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Votes enregistrés</div>
            <div className="stat-value text-blue-600">{stats.votes}</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher (description, utilisateur, IP...)"
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="input-field pl-10"
                value={filtreAction}
                onChange={(e) => setFiltreAction(e.target.value)}
              >
                <option value="all">Toutes les actions</option>
                {actionTypes.map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                className="input-field"
                value={filtreResultat}
                onChange={(e) => setFiltreResultat(e.target.value)}
              >
                <option value="all">Tous les résultats</option>
                <option value="SUCCESS">Succès uniquement</option>
                <option value="FAILURE">Échecs uniquement</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              Réinitialiser
            </button>
          </div>

          {/* Filtres de date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  className="input-field pl-10"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  className="input-field pl-10"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des logs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date/Heure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Résultat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logsFiltres.map((log) => {
                  const actionInfo = getActionInfo(log.action_type);
                  const ActionIcon = actionInfo.icon;
                  const dateTime = formatDateTime(log.created_at);

                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{dateTime.date}</div>
                        <div className="text-xs text-gray-500">{dateTime.time}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionInfo.color}`}
                        >
                          <ActionIcon size={14} />
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                        <div className="text-xs text-gray-500">{log.user_email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {log.ip_address}
                      </td>
                      <td className="px-4 py-3">
                        {log.resultat === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle size={16} />
                            Succès
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                            <XCircle size={16} />
                            Échec
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {logsFiltres.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">Aucune entrée de log trouvée</p>
              <p className="text-sm text-gray-400">Essayez de modifier vos filtres</p>
            </div>
          )}

          {/* Pagination simple */}
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage de <strong>{logsFiltres.length}</strong> entrée
              {logsFiltres.length > 1 ? "s" : ""} sur <strong>{logs.length}</strong>
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50"
                disabled
              >
                Précédent
              </button>
              <button
                className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50"
                disabled
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Audit;
