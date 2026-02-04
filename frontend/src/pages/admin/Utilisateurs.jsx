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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Administrateurs</div>
            <div className="stat-value text-purple-600">{stats.admins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Électeurs</div>
            <div className="stat-value text-blue-600">{stats.voters}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Auditeurs</div>
            <div className="stat-value text-green-600">{stats.auditors}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Inactifs</div>
            <div className="stat-value text-red-600">{stats.inactifs}</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
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
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="input-field pl-10"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs uniquement</option>
                <option value="inactif">Inactifs uniquement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Votes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {utilisateursFiltres.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {user.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="font-medium text-gray-900">{user.nom}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}
                        >
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatut(user.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.statut === "actif"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {user.statut === "actif" ? <UserCheck size={14} /> : <UserX size={14} />}
                          {user.statut === "actif" ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{user.nb_votes}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
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
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Modal Création/Édition */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalMode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      name="nom"
                      className="input-field"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Ex: DOHOU Ercias Audrey"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email institutionnel *</label>
                    <input
                      type="email"
                      name="email"
                      className="input-field"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="prenom.nom@universite.bj"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      L'utilisateur recevra un code OTP à cette adresse pour se connecter
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rôle *</label>
                    <select
                      name="role"
                      className="input-field"
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
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p>
                        <strong>Administrateur:</strong> Gestion complète du système
                      </p>
                      <p>
                        <strong>Électeur:</strong> Participation aux votes uniquement
                      </p>
                      <p>
                        <strong>Auditeur:</strong> Consultation des logs et résultats
                      </p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut *</label>
                    <select
                      name="statut"
                      className="input-field"
                      value={formData.statut}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Les utilisateurs inactifs ne peuvent pas se connecter
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
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
