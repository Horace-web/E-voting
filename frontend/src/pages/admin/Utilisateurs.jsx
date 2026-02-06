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
  UserCheck,
  UserX,
  Download,
  Mail,
  Loader2,
  User,
  Shield,
  AlertCircle,
  Info,
  CheckCircle2,
  Users as UsersIcon,
  UserCog,
  Eye,
  UserMinus,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import userService from "../../services/user.service";
import config from "../../config/app.config";
import "../../pages/Admin.css";

function Utilisateurs() {
  // Mock data pour les utilisateurs
  const [utilisateurs, setUtilisateurs] = useState([
    {
      id: "1",
      nom: "ODOUNLAMI Horace",
      email: "horace.odounlami@universite.bj",
      role: "admin",
      statut: "actif",
      created_at: "2026-01-15T10:30:00",
      last_login: "2026-02-02T08:15:00",
      nb_votes: 0,
    },
    {
      id: "2",
      nom: "DOHOU Ercias Audrey",
      email: "ercias.dohou@universite.bj",
      role: "voter",
      statut: "actif",
      created_at: "2026-01-20T14:20:00",
      last_login: "2026-02-01T16:45:00",
      nb_votes: 2,
    },
    {
      id: "3",
      nom: "HOUNDETON Jeffry",
      email: "jeffry.houndeton@universite.bj",
      role: "voter",
      statut: "actif",
      created_at: "2026-01-20T14:25:00",
      last_login: "2026-02-01T12:30:00",
      nb_votes: 1,
    },
    {
      id: "4",
      nom: "SOGOE Bryan",
      email: "bryan.sogoe@universite.bj",
      role: "voter",
      statut: "actif",
      created_at: "2026-01-20T14:30:00",
      last_login: "2026-01-28T09:20:00",
      nb_votes: 1,
    },
    {
      id: "5",
      nom: "ADJOVI Marie",
      email: "marie.adjovi@universite.bj",
      role: "auditor",
      statut: "actif",
      created_at: "2026-01-18T11:00:00",
      last_login: "2026-02-01T18:00:00",
      nb_votes: 0,
    },
    {
      id: "6",
      nom: "KOUASSI Paul",
      email: "paul.kouassi@universite.bj",
      role: "voter",
      statut: "inactif",
      created_at: "2026-01-22T09:15:00",
      last_login: null,
      nb_votes: 0,
    },
  ]);

  const [filtreRole, setFiltreRole] = useState("all");
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    role: "voter",
    statut: "actif",
  });

  // Rôles disponibles
  const roles = [
    { value: "admin", label: "Administrateur", color: "bg-purple-100 text-purple-700" },
    { value: "voter", label: "Électeur", color: "bg-blue-100 text-blue-700" },
    { value: "auditor", label: "Auditeur", color: "bg-green-100 text-green-700" },
  ];

  // Filtrage des utilisateurs
  const utilisateursFiltres = utilisateurs.filter((user) => {
    const matchRole = filtreRole === "all" || user.role === filtreRole;
    const matchStatut = filtreStatut === "all" || user.statut === filtreStatut;
    const matchSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchStatut && matchSearch;
  });

  // Statistiques
  const stats = {
    total: utilisateurs.length,
    actifs: utilisateurs.filter((u) => u.statut === "actif").length,
    inactifs: utilisateurs.filter((u) => u.statut === "inactif").length,
    admins: utilisateurs.filter((u) => u.role === "admin").length,
    voters: utilisateurs.filter((u) => u.role === "voter").length,
    auditors: utilisateurs.filter((u) => u.role === "auditor").length,
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      nom: "",
      email: "",
      role: "voter",
      statut: "actif",
    });
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      email: user.email,
      role: user.role,
      statut: user.statut,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "create") {
      const nouvelUtilisateur = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        last_login: null,
        nb_votes: 0,
      };
      setUtilisateurs([...utilisateurs, nouvelUtilisateur]);
    } else {
      setUtilisateurs(
        utilisateurs.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u))
      );
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const user = utilisateurs.find((u) => u.id === id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.nom} ?`)) {
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
    }
  };

  const toggleStatut = (id) => {
    setUtilisateurs(
      utilisateurs.map((u) =>
        u.id === id ? { ...u, statut: u.statut === "actif" ? "inactif" : "actif" } : u
      )
    );
  };

  const handleImportCSV = () => {
    // Simulation import CSV
    const nouveauxUtilisateurs = [
      {
        id: Date.now().toString(),
        nom: "AKPO Jean",
        email: "jean.akpo@universite.bj",
        role: "voter",
        statut: "actif",
        created_at: new Date().toISOString(),
        last_login: null,
        nb_votes: 0,
      },
      {
        id: (Date.now() + 1).toString(),
        nom: "GBEDO Sarah",
        email: "sarah.gbedo@universite.bj",
        role: "voter",
        statut: "actif",
        created_at: new Date().toISOString(),
        last_login: null,
        nb_votes: 0,
      },
    ];
    setUtilisateurs([...utilisateurs, ...nouveauxUtilisateurs]);
    setShowImportModal(false);
    alert(`${nouveauxUtilisateurs.length} utilisateurs importés avec succès !`);
  };

  const exportCSV = () => {
    const headers = [
      "Nom",
      "Email",
      "Rôle",
      "Statut",
      "Date création",
      "Dernière connexion",
      "Votes",
    ];
    const rows = utilisateurs.map((u) => [
      u.nom,
      u.email,
      roles.find((r) => r.value === u.role)?.label || u.role,
      u.statut,
      new Date(u.created_at).toLocaleDateString("fr-FR"),
      u.last_login ? new Date(u.last_login).toLocaleDateString("fr-FR") : "Jamais",
      u.nb_votes,
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
    return roleInfo
      ? { label: roleInfo.label, color: roleInfo.color }
      : { label: role, color: "bg-gray-100 text-gray-700" };
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
            <p className="text-gray-600">
              {stats.total} utilisateur{stats.total > 1 ? "s" : ""} · {stats.actifs} actif
              {stats.actifs > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-secondary flex items-center gap-2"
              onClick={() => setShowImportModal(true)}
            >
              <Upload size={20} />
              Importer CSV
            </button>
            <button className="btn-secondary flex items-center gap-2" onClick={exportCSV}>
              <Download size={20} />
              Exporter
            </button>
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={20} />
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="text-blue-600" size={24} />
              </div>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Total utilisateurs</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Administrateurs</div>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Électeurs</div>
            <div className="text-2xl font-bold text-blue-600">{stats.voters}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Auditeurs</div>
            <div className="text-2xl font-bold text-green-600">{stats.auditors}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserMinus className="text-red-600" size={24} />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Inactifs</div>
            <div className="text-2xl font-bold text-red-600">{stats.inactifs}</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-sm font-semibold text-gray-700">Filtres et recherche</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Shield
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                value={filtreRole}
                onChange={(e) => setFiltreRole(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <CheckCircle2
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs uniquement</option>
                <option value="inactif">Inactifs uniquement</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {(searchTerm || filtreRole !== 'all' || filtreStatut !== 'all') && (
            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">
                <strong>{utilisateursFiltres.length}</strong> utilisateur{utilisateursFiltres.length > 1 ? 's' : ''} trouvé{utilisateursFiltres.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFiltreRole('all');
                  setFiltreStatut('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <X size={16} />
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Utilisateur
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rôle
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Statut
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Dernière connexion
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Votes
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {utilisateursFiltres.map((user, index) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr 
                      key={user.id} 
                      className="hover:bg-blue-50/30 transition-colors group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                            {user.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.nom}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${roleBadge.color}`}>
                            {user.role === 'admin' && <Shield size={12} />}
                            {user.role === 'electeur' && <User size={12} />}
                            {user.role === 'auditeur' && <Eye size={12} />}
                            {roleBadge.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatut(user.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            user.statut === "actif"
                              ? "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                          }`}
                          title="Cliquez pour changer le statut"
                        >
                          {user.statut === "actif" ? <UserCheck size={14} /> : <UserX size={14} />}
                          {user.statut === "actif" ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(user.last_login)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                            {user.nb_votes}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="group/btn p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:shadow-md"
                            title="Modifier l'utilisateur"
                          >
                            <Edit2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="group/btn p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:shadow-md"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {utilisateursFiltres.length === 0 && (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-gray-400" size={32} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">Aucun utilisateur trouvé</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchTerm || filtreRole !== 'all' || filtreStatut !== 'all'
                      ? "Essayez de modifier vos filtres de recherche"
                      : "Commencez par créer un nouvel utilisateur"}
                  </p>
                </div>
                {(searchTerm || filtreRole !== 'all' || filtreStatut !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFiltreRole('all');
                      setFiltreStatut('all');
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Création/Édition */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {modalMode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {modalMode === "create" 
                          ? "Ajoutez un nouvel utilisateur à la plateforme" 
                          : "Modifiez les informations de l'utilisateur"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="px-6 py-6 space-y-6">
                  
                  {/* Info Banner */}
                  {modalMode === "create" && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
                      <Info className="text-blue-600 flex-shrink-0" size={20} />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 mb-1">
                          Création automatique du compte
                        </p>
                        <p className="text-blue-700">
                          Un email de bienvenue avec les instructions de connexion sera envoyé à l'utilisateur.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Nom complet */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        name="nom"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Ex: DOHOU Ercias Audrey"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Entrez le nom complet (nom et prénom)
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email institutionnel <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="prenom.nom@universite.bj"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      L'utilisateur recevra un code OTP à cette adresse pour se connecter
                    </p>
                  </div>

                  {/* Grid pour Rôle et Statut */}
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Rôle */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rôle <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield className="text-gray-400" size={20} />
                        </div>
                        <select
                          name="role"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Statut */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CheckCircle2 className="text-gray-400" size={20} />
                        </div>
                        <select
                          name="statut"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                          value={formData.statut}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="actif">Actif</option>
                          <option value="inactif">Inactif</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions des rôles */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Description des rôles</p>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">Administrateur :</span>
                        <span className="text-gray-600"> Gestion complète du système (élections, utilisateurs, résultats)</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">Électeur :</span>
                        <span className="text-gray-600"> Participation aux votes uniquement</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">Auditeur :</span>
                        <span className="text-gray-600"> Consultation des logs et résultats, sans modification</span>
                      </div>
                    </div>
                  </div>

                  {/* Note sur le statut */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={18} />
                    <p className="text-sm text-amber-800">
                      Les utilisateurs avec le statut <strong>"Inactif"</strong> ne pourront pas se connecter à la plateforme.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all shadow-lg hover:shadow-xl"
                  >
                    {modalMode === "create"
                      ? "Créer l'utilisateur"
                      : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Import CSV */}
        {showImportModal && (
          <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Importer des utilisateurs (CSV)</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Format du fichier CSV</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Votre fichier doit contenir les colonnes suivantes :
                  </p>
                  <code className="block bg-white p-3 rounded text-xs">
                    nom,email,role,statut
                    <br />
                    AKPO Jean,jean.akpo@universite.bj,voter,actif
                    <br />
                    GBEDO Sarah,sarah.gbedo@universite.bj,voter,actif
                  </code>
                  <p className="text-xs text-blue-600 mt-3">
                    <strong>Rôles acceptés:</strong> admin, voter, auditor
                    <br />
                    <strong>Statuts acceptés:</strong> actif, inactif
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez pour sélectionner un fichier CSV
                  </p>
                  <p className="text-xs text-gray-500">ou glissez-déposez le fichier ici</p>
                  <input type="file" accept=".csv" className="hidden" />
                </div>

                <div className="mt-4">
                  <button onClick={handleImportCSV} className="w-full btn-primary">
                    Simuler l'import (2 utilisateurs)
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowImportModal(false)} className="btn-secondary">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Utilisateurs;
