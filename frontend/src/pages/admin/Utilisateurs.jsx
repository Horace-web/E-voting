import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Filter,
  Download,
  Mail,
  User,
  Shield,
  AlertCircle,
  Info,
  CheckCircle2,
  Users as UsersIcon,
  Eye,
  UserMinus,
  TrendingUp,
} from "lucide-react";
import userService from "../../services/user.service";
import api from "../../api/axios";
import "../../pages/Admin.css";

const normalizeRoleValue = (role) => {
  if (!role) return "";
  if (typeof role === "string") return role.toLowerCase();
  if (typeof role === "object") return String(role.code || role.value || "").toLowerCase();
  return "";
};

const normalizeUsers = (payload) => {
  const raw = Array.isArray(payload)
    ? payload
    : payload?.data?.data || payload?.data || payload?.users || [];

  return (Array.isArray(raw) ? raw : []).map((user) => ({
    ...user,
    role: normalizeRoleValue(user.role),
    role_label: user.role?.nom || user.role?.label || user.role || "",
    nb_votes: Number(user.nb_votes || 0),
  }));
};

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);

  const [filtreRole, setFiltreRole] = useState("all");
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({ nom: "", email: "", role_id: "" });

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await api.get("/roles");
      const rolesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const mappedRoles = rolesData.map((role) => ({
        id: role.id,
        value: normalizeRoleValue(role.code || role.value),
        label: role.nom || role.label,
        color: getRoleColor(role.code || role.value),
      }));
      setRoles(mappedRoles);
    } catch (error) {
      console.warn("API /api/roles non disponible, utilisation des IDs fallback");
      setRoles([
        { id: "2663d911-9966-4268-845d-0aaf03f7745a", value: "admin", label: "Administrateur", color: "bg-purple-100 text-purple-700" },
        { id: "23dd4542-7186-4429-b504-50b1927a1530", value: "voter", label: "Électeur", color: "bg-blue-100 text-blue-700" },
        { id: "e37ad6cd-d8b3-4ab5-9be7-9b6cc0300ac8", value: "auditor", label: "Auditeur", color: "bg-green-100 text-green-700" },
      ]);
    }
  };

  const getRoleColor = (roleCode) => {
    const value = normalizeRoleValue(roleCode).toUpperCase();
    const colors = {
      ADMIN: "bg-purple-100 text-purple-700",
      VOTER: "bg-blue-100 text-blue-700",
      AUDITOR: "bg-green-100 text-green-700",
    };
    return colors[value] || "bg-gray-100 text-gray-700";
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUtilisateurs(normalizeUsers(response));
    } catch (error) {
      console.warn("Erreur chargement utilisateurs:", error);
      setErrorMessage("Impossible de charger les utilisateurs");
      setUtilisateurs([]);
    } finally {
      setLoading(false);
    }
  };

  const utilisateursFiltres = utilisateurs.filter((user) => {
    const matchRole = filtreRole === "all" || user.role === filtreRole;
    const matchStatut = filtreStatut === "all" || user.statut === filtreStatut;
    const matchSearch =
      user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchStatut && matchSearch;
  });

  const stats = {
    total: utilisateurs.length,
    actifs: utilisateurs.filter((u) => u.statut === "actif").length,
    inactifs: utilisateurs.filter((u) => ["inactif", "en_attente"].includes(u.statut)).length,
    admins: utilisateurs.filter((u) => u.role === "admin").length,
    voters: utilisateurs.filter((u) => u.role === "voter").length,
    auditors: utilisateurs.filter((u) => u.role === "auditor").length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ nom: "", email: "", role_id: "" });
    setSelectedUser(null);
    setSuccessMessage("");
    setErrorMessage("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({ nom: user.nom, email: user.email, role_id: user.role_id, statut: user.statut });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (modalMode === "create") {
        await userService.create({ nom: formData.nom, email: formData.email, role_id: formData.role_id });
        setSuccessMessage(`Utilisateur créé avec succès. En local, l'email de vérification est généralement écrit dans les logs Laravel et non envoyé réellement.`);
        await loadUsers();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMessage("");
        }, 2500);
      } else {
        await userService.update(selectedUser.id, formData);
        setSuccessMessage("Utilisateur mis à jour avec succès.");
        await loadUsers();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur utilisateur:", error);
      if (error.response?.status === 409) {
        setErrorMessage("Cet email est déjà utilisé");
      } else {
        setErrorMessage(error.response?.data?.message || "Erreur lors de la création de l'utilisateur");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const user = utilisateurs.find((u) => u.id === id);
    if (!window.confirm(`Etes-vous sur de vouloir supprimer ${user.nom} ?`)) return;

    try {
      setLoading(true);
      await userService.delete(id);
      setSuccessMessage("Utilisateur supprime avec succes.");
      await loadUsers();
    } catch (error) {
      console.error("Erreur suppression:", error);
      setErrorMessage(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await userService.importCSV(file);
      setSuccessMessage("Importation reussie !");
      await loadUsers();
      setShowImportModal(false);
    } catch (error) {
      console.error("Erreur import:", error);
      setErrorMessage(error.response?.data?.message || "Erreur lors de l'importation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Nom", "Email", "Rôle", "Statut", "Date création", "Dernière connexion", "Votes"];
    const rows = utilisateurs.map((u) => [
      u.nom,
      u.email,
      roles.find((r) => r.value === u.role)?.label || u.role_label || u.role,
      u.statut,
      new Date(u.created_at).toLocaleDateString("fr-FR"),
      u.last_login ? new Date(u.last_login).toLocaleDateString("fr-FR") : "Jamais",
      u.nb_votes || 0,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getRoleBadge = (role) => {
    const roleInfo = roles.find((r) => r.value === role);
    return roleInfo ? { label: roleInfo.label, color: roleInfo.color } : { label: role, color: "bg-gray-100 text-gray-700" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Gestion des Utilisateurs</h1>
            <p className="text-gray-600">{stats.total} utilisateur{stats.total > 1 ? "s" : ""} · {stats.actifs} actif{stats.actifs > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2" onClick={() => setShowImportModal(true)}><Upload size={20} />Importer CSV</button>
            <button className="btn-secondary flex items-center gap-2" onClick={exportCSV}><Download size={20} />Exporter</button>
            <button className="btn-primary" onClick={openCreateModal}><Plus size={20} />Nouvel utilisateur</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500"><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><UsersIcon className="text-blue-600" size={24} /></div><TrendingUp className="text-blue-400" size={20} /></div><div className="text-sm font-medium text-gray-600 mb-1">Total utilisateurs</div><div className="text-2xl font-bold text-gray-900">{stats.total}</div></div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500"><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Shield className="text-purple-600" size={24} /></div></div><div className="text-sm font-medium text-gray-600 mb-1">Administrateurs</div><div className="text-2xl font-bold text-purple-600">{stats.admins}</div></div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500"><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><User className="text-blue-600" size={24} /></div></div><div className="text-sm font-medium text-gray-600 mb-1">Électeurs</div><div className="text-2xl font-bold text-blue-600">{stats.voters}</div></div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500"><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Eye className="text-green-600" size={24} /></div></div><div className="text-sm font-medium text-gray-600 mb-1">Auditeurs</div><div className="text-2xl font-bold text-green-600">{stats.auditors}</div></div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500"><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><UserMinus className="text-red-600" size={24} /></div></div><div className="text-sm font-medium text-gray-600 mb-1">Inactifs</div><div className="text-2xl font-bold text-red-600">{stats.inactifs}</div></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4"><Filter className="text-gray-600" size={20} /><h3 className="text-sm font-semibold text-gray-700">Filtres et recherche</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Rechercher par nom ou email..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="relative"><Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><select className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer" value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)}><option value="all">Tous les rôles</option>{roles.map((role) => (<option key={role.value} value={role.value}>{role.label}</option>))}</select></div>
            <div className="relative"><CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><select className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}><option value="all">Tous les statuts</option><option value="actif">Actifs uniquement</option><option value="inactif">Inactifs uniquement</option><option value="en_attente">En attente</option></select></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dernière connexion</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Votes</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {utilisateursFiltres.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4"><div className="font-semibold text-gray-900">{user.nom}</div></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${roleBadge.color}`}>{roleBadge.label}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-gray-700">{user.statut}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.last_login)}</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">{user.nb_votes || 0}</span></td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEditModal(user)} className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"><Edit2 size={18} /></button><button onClick={() => handleDelete(user.id)} className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={18} /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {utilisateursFiltres.length === 0 && (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><AlertCircle className="text-gray-400" size={32} /></div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">Aucun utilisateur trouvé</p>
                  <p className="text-gray-500 text-sm mt-1">{searchTerm || filtreRole !== "all" || filtreStatut !== "all" ? "Essayez de modifier vos filtres de recherche" : "Commencez par créer un nouvel utilisateur"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><User className="text-white" size={24} /></div><div><h2 className="text-xl font-bold text-white">{modalMode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}</h2></div></div>
                  <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white rounded-lg p-2 transition-all"><X size={24} /></button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="px-6 py-6 space-y-6">
                  {successMessage && <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex gap-3"><CheckCircle2 className="text-green-600 flex-shrink-0" size={20} /><div className="text-sm"><p className="font-semibold text-green-900 mb-1">Succès</p><p className="text-green-700">{successMessage}</p></div></div>}
                  {errorMessage && <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3"><AlertCircle className="text-red-600 flex-shrink-0" size={20} /><div className="text-sm"><p className="font-semibold text-red-900 mb-1">Erreur</p><p className="text-red-700">{errorMessage}</p></div></div>}
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3"><Info className="text-blue-600 flex-shrink-0" size={20} /><div className="text-sm"><p className="font-semibold text-blue-900 mb-1">En local</p><p className="text-blue-700">L'email de vérification n'est généralement pas envoyé réellement. Avec MAIL_MAILER=log, il est écrit dans les logs Laravel.</p></div></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label><input type="text" name="nom" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={formData.nom} onChange={handleInputChange} required /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email institutionnel</label><input type="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={formData.email} onChange={handleInputChange} required /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">Rôle</label><select name="role_id" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={formData.role_id} onChange={handleInputChange} required><option value="">Sélectionnez un rôle</option>{roles.map((role) => (<option key={role.id} value={role.id}>{role.label}</option>))}</select></div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t">
                  <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium">Annuler</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold">{isSubmitting ? "Enregistrement..." : modalMode === "create" ? "Créer l'utilisateur" : "Enregistrer"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showImportModal && (
          <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h2 className="modal-title">Importer des utilisateurs (CSV)</h2><button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
              <div className="modal-body">
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center block cursor-pointer hover:border-[#1e3a5f] transition-all">
                  <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Cliquez pour selectionner un fichier CSV</p>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleImportCSV} 
                    disabled={isSubmitting}
                  />
                </label>
                {isSubmitting && (
                  <div className="mt-4 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#1e3a5f]" size={24} />
                    <p className="text-sm text-gray-600 mt-2">Importation en cours...</p>
                  </div>
                )}
              </div>
              <div className="modal-footer"><button onClick={() => setShowImportModal(false)} className="btn-secondary">Fermer</button></div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Utilisateurs;
