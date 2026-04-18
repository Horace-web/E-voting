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
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import auditService from "../../services/audit.service";
import "../../pages/Admin.css";

const safeText = (value) => String(value ?? "").trim();

const normalizeLogsPayload = (payload) => {
  const page = payload?.data ?? payload ?? {};
  const rows = Array.isArray(page?.data) ? page.data : Array.isArray(payload) ? payload : [];

  return {
    rows: rows.map((log) => {
      const role = safeText(log?.metadata?.role);
      const email = safeText(log?.metadata?.email);
      const actionCode = safeText(log?.action).toUpperCase();

      return {
        id: log?.id,
        created_at: log?.created_at,
        description: safeText(log?.model) + (log?.model_id ? ` ${log.model_id}` : ""),
        user_name: safeText(log?.user?.nom) || email || "Utilisateur inconnu",
        user_email: email,
        user_role: role,
        ip_address: safeText(log?.ip_address),
        resultat: actionCode.includes("FAILED") ? "FAILURE" : "SUCCESS",
        action_type: actionCode,
        raw: log,
      };
    }),
    currentPage: Number(page?.current_page || 1),
    lastPage: Number(page?.last_page || 1),
    total: Number(page?.total || rows.length || 0),
    perPage: Number(page?.per_page || rows.length || 0),
    from: Number(page?.from || (rows.length ? 1 : 0)),
    to: Number(page?.to || rows.length || 0),
    hasPrev: Boolean(page?.prev_page_url),
    hasNext: Boolean(page?.next_page_url),
  };
};

const actionTypes = [
  { value: "LOGIN", label: "Connexion", icon: LogIn, color: "text-green-600 bg-green-50" },
  { value: "LOGOUT", label: "Deconnexion", icon: LogOut, color: "text-gray-600 bg-gray-50" },
  { value: "LOGIN_FAILED", label: "Echec connexion", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  { value: "VOTE", label: "Vote", icon: Vote, color: "text-blue-600 bg-blue-50" },
  { value: "CREATED", label: "Creation", icon: Edit, color: "text-purple-600 bg-purple-50" },
  { value: "UPDATED", label: "Modification", icon: Edit, color: "text-cyan-600 bg-cyan-50" },
  { value: "DELETED", label: "Suppression", icon: Trash2, color: "text-red-600 bg-red-50" },
  { value: "PUBLISH_ELECTION", label: "Publication election", icon: Eye, color: "text-indigo-600 bg-indigo-50" },
  { value: "CLOSE_ELECTION", label: "Cloture election", icon: CheckCircle, color: "text-amber-600 bg-amber-50" },
  { value: "EXPORT_RESULTS", label: "Export resultats", icon: Download, color: "text-pink-600 bg-pink-50" },
];

const getActionInfo = (actionType) => {
  return (
    actionTypes.find((item) => item.value === safeText(actionType).toUpperCase()) || {
      label: safeText(actionType) || "Action",
      icon: ClipboardList,
      color: "text-gray-600 bg-gray-50",
    }
  );
};

function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreAction, setFiltreAction] = useState("all");
  const [filtreResultat, setFiltreResultat] = useState("all");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 0,
    from: 0,
    to: 0,
    hasPrev: false,
    hasNext: false,
  });

  useEffect(() => {
    loadLogs(1);
  }, []);

  const loadLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await auditService.getAll({ page, per_page: 50 });
      const normalized = normalizeLogsPayload(response);
      setLogs(normalized.rows);
      setPagination({
        currentPage: normalized.currentPage,
        lastPage: normalized.lastPage,
        total: normalized.total,
        perPage: normalized.perPage,
        from: normalized.from,
        to: normalized.to,
        hasPrev: normalized.hasPrev,
        hasNext: normalized.hasNext,
      });
    } catch (error) {
      console.warn("Erreur chargement logs d'audit:", error);
      setLogs([]);
      setPagination({ currentPage: 1, lastPage: 1, total: 0, perPage: 0, from: 0, to: 0, hasPrev: false, hasNext: false });
    } finally {
      setLoading(false);
    }
  };

  const logsFiltres = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    const description = safeText(log.description).toLowerCase();
    const userName = safeText(log.user_name).toLowerCase();
    const userEmail = safeText(log.user_email).toLowerCase();
    const ipAddress = safeText(log.ip_address).toLowerCase();
    const action = safeText(log.action_type).toUpperCase();
    const resultat = safeText(log.resultat).toUpperCase();

    const matchSearch =
      description.includes(search) ||
      userName.includes(search) ||
      userEmail.includes(search) ||
      ipAddress.includes(search);
    const matchAction = filtreAction === "all" || action === filtreAction;
    const matchResultat = filtreResultat === "all" || resultat === filtreResultat;

    let matchDate = true;
    if (dateDebut && log.created_at) matchDate = matchDate && new Date(log.created_at) >= new Date(dateDebut);
    if (dateFin && log.created_at) matchDate = matchDate && new Date(log.created_at) <= new Date(`${dateFin}T23:59:59`);

    return matchSearch && matchAction && matchResultat && matchDate;
  });

  const stats = {
    total: pagination.total,
    succes: logs.filter((item) => item.resultat === "SUCCESS").length,
    echecs: logs.filter((item) => item.resultat === "FAILURE").length,
    votes: logs.filter((item) => item.action_type === "VOTE").length,
  };

  const exportCSV = async () => {
    try {
      const blob = await auditService.exportCSV({ page: pagination.currentPage, per_page: 50 });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit_log_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn("Export backend indisponible, export local utilise.", error);
      const headers = ["Date", "Heure", "Action", "Description", "Utilisateur", "Email", "Role", "IP", "Resultat"];
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
      const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit_log_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("fr-FR"),
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
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
            <h1>Journal d'audit</h1>
            <p className="text-gray-600">Tracabilite complete des actions sur la plateforme</p>
          </div>
          <button onClick={exportCSV} className="btn-primary flex items-center gap-2 hover:shadow-md transition-all">
            <Download size={20} />
            Exporter CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total actions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><ClipboardList className="text-blue-600" size={24} /></div>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500"><TrendingUp size={14} className="mr-1" />Toutes les activites</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Reussies</p>
                <p className="text-2xl font-bold text-green-600">{stats.succes}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="text-green-600" size={24} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Echouees</p>
                <p className="text-2xl font-bold text-red-600">{stats.echecs}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><XCircle className="text-red-600" size={24} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Votes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.votes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Vote className="text-purple-600" size={24} /></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Votes enregistres</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4"><Filter className="text-[#1e3a5f]" size={20} /><h3 className="font-semibold text-gray-900">Filtres et recherche</h3></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Rechercher (description, utilisateur, IP...)" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer" value={filtreAction} onChange={(e) => setFiltreAction(e.target.value)}>
                <option value="all">Toutes les actions</option>
                {actionTypes.map((action) => <option key={action.value} value={action.value}>{action.label}</option>)}
              </select>
            </div>

            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer" value={filtreResultat} onChange={(e) => setFiltreResultat(e.target.value)}>
                <option value="all">Tous les resultats</option>
                <option value="SUCCESS">Succes uniquement</option>
                <option value="FAILURE">Echecs uniquement</option>
              </select>
            </div>

            <button onClick={resetFilters} className="flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all font-medium border border-gray-300"><RefreshCw size={18} />Reinitialiser</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de debut</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left"><div className="flex items-center gap-2"><Clock size={16} className="text-gray-500" /><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Date/Heure</span></div></th>
                  <th className="px-4 py-4 text-left"><div className="flex items-center gap-2"><Shield size={16} className="text-gray-500" /><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</span></div></th>
                  <th className="px-4 py-4 text-left"><div className="flex items-center gap-2"><ClipboardList size={16} className="text-gray-500" /><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</span></div></th>
                  <th className="px-4 py-4 text-left"><div className="flex items-center gap-2"><User size={16} className="text-gray-500" /><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</span></div></th>
                  <th className="px-4 py-4 text-left"><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">IP</span></th>
                  <th className="px-4 py-4 text-left"><div className="flex items-center gap-2"><CheckCircle size={16} className="text-gray-500" /><span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Resultat</span></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsFiltres.map((log, index) => {
                  const actionInfo = getActionInfo(log.action_type);
                  const ActionIcon = actionInfo.icon;
                  const dateTime = formatDateTime(log.created_at);
                  return (
                    <tr key={log.id || index} className="hover:bg-blue-50/30 transition-colors" style={{ animationDelay: `${index * 0.03}s` }}>
                      <td className="px-4 py-4"><div className="text-sm font-semibold text-gray-900">{dateTime.date}</div><div className="text-xs text-gray-500 font-medium">{dateTime.time}</div></td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${actionInfo.color}`}><ActionIcon size={14} />{actionInfo.label}</span></td>
                      <td className="px-4 py-4"><p className="text-sm text-gray-700 max-w-xs truncate" title={log.description}>{log.description}</p></td>
                      <td className="px-4 py-4"><div className="text-sm font-semibold text-gray-900">{log.user_name}</div><div className="text-xs text-gray-500">{log.user_email}</div></td>
                      <td className="px-4 py-4"><span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">{log.ip_address}</span></td>
                      <td className="px-4 py-4">
                        {log.resultat === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1.5 text-green-700 text-sm font-semibold bg-green-50 px-3 py-1.5 rounded-lg"><CheckCircle size={16} />Succes</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-700 text-sm font-semibold bg-red-50 px-3 py-1.5 rounded-lg"><XCircle size={16} />Echec</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {logsFiltres.length === 0 && (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"><ClipboardList className="text-gray-400" size={40} /></div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">Aucune entree de log trouvee</p>
                  <p className="text-gray-500 text-sm mt-1">Essayez de modifier vos filtres de recherche</p>
                </div>
                <button onClick={resetFilters} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"><RefreshCw size={16} />Reinitialiser les filtres</button>
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">
              Affichage de <strong className="text-blue-600">{pagination.from}</strong> a <strong className="text-blue-600">{pagination.to}</strong> sur <strong className="text-gray-900">{pagination.total}</strong>
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={!pagination.hasPrev || loading} onClick={() => loadLogs(pagination.currentPage - 1)}>
                Precedent
              </button>
              <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={!pagination.hasNext || loading} onClick={() => loadLogs(pagination.currentPage + 1)}>
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
