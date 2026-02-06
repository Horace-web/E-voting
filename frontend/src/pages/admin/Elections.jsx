import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Play,
  StopCircle,
  Eye,
  Filter,
  X,
  Loader2,
  Vote,
  FileText,
  Clock,
  Info,
  AlertCircle,
  CalendarCheck,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import electionService from "../../services/election.service";
import config from "../../config/app.config";
import { mockElections } from "../../data/mockData";

const Elections = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);

  // Mock data
  const [elections, setElections] = useState([
    {
      id: 1,
      titre: "Élection du Président de l'Université",
      description: "Élection du président pour le mandat 2026-2030",
      dateOuverture: "2026-02-15T08:00",
      dateCloture: "2026-02-20T18:00",
      statut: "Publiée",
      nombreCandidats: 5,
      nombreVotants: 2547,
      participationActuelle: 0,
    },
    {
      id: 2,
      titre: "Représentant Étudiant au Conseil",
      description: "Élection des représentants étudiants",
      dateOuverture: "2026-02-10T08:00",
      dateCloture: "2026-02-12T18:00",
      statut: "En cours",
      nombreCandidats: 8,
      nombreVotants: 1523,
      participationActuelle: 892,
    },
    {
      id: 3,
      titre: "Délégué de Promotion Master 2",
      description: "Élection du délégué de promotion",
      dateOuverture: "2026-01-20T08:00",
      dateCloture: "2026-01-25T18:00",
      statut: "Clôturée",
      nombreCandidats: 4,
      nombreVotants: 234,
      participationActuelle: 234,
    },
    {
      id: 4,
      titre: "Commission des Sports Universitaires",
      description: "Membres de la commission sports",
      dateOuverture: "",
      dateCloture: "",
      statut: "Brouillon",
      nombreCandidats: 0,
      nombreVotants: 1200,
      participationActuelle: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    dateOuverture: "",
    dateCloture: "",
  });

  const tabs = [
    { id: "all", label: "Toutes", count: elections.length },
    {
      id: "brouillon",
      label: "Brouillons",
      count: elections.filter((e) => e.statut === "Brouillon").length,
    },
    {
      id: "publiee",
      label: "Publiées",
      count: elections.filter((e) => e.statut === "Publiée").length,
    },
    {
      id: "encours",
      label: "En cours",
      count: elections.filter((e) => e.statut === "En cours").length,
    },
    {
      id: "cloturee",
      label: "Clôturées",
      count: elections.filter((e) => e.statut === "Clôturée").length,
    },
  ];

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Brouillon":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Publiée":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "En cours":
        return "bg-green-100 text-green-700 border-green-200";
      case "Clôturée":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredElections = elections.filter((election) => {
    const matchesSearch =
      election.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "brouillon") return matchesSearch && election.statut === "Brouillon";
    if (activeTab === "publiee") return matchesSearch && election.statut === "Publiée";
    if (activeTab === "encours") return matchesSearch && election.statut === "En cours";
    if (activeTab === "cloturee") return matchesSearch && election.statut === "Clôturée";
    return matchesSearch;
  });

  const handleCreateElection = () => {
    setEditingElection(null);
    setFormData({
      titre: "",
      description: "",
      dateOuverture: "",
      dateCloture: "",
    });
    setShowModal(true);
  };

  const handleEditElection = (election) => {
    setEditingElection(election);
    setFormData({
      titre: election.titre,
      description: election.description,
      dateOuverture: election.dateOuverture,
      dateCloture: election.dateCloture,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingElection) {
      // Mise à jour
      setElections(
        elections.map((el) => (el.id === editingElection.id ? { ...el, ...formData } : el))
      );
    } else {
      // Création
      const newElection = {
        id: elections.length + 1,
        ...formData,
        statut: "Brouillon",
        nombreCandidats: 0,
        nombreVotants: 0,
        participationActuelle: 0,
      };
      setElections([...elections, newElection]);
    }

    setShowModal(false);
    setFormData({
      titre: "",
      description: "",
      dateOuverture: "",
      dateCloture: "",
    });
  };

  const handlePublish = (id) => {
    setElections(elections.map((el) => (el.id === id ? { ...el, statut: "Publiée" } : el)));
  };

  const handleClose = (id) => {
    setElections(elections.map((el) => (el.id === id ? { ...el, statut: "Clôturée" } : el)));
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette élection ?")) {
      setElections(elections.filter((el) => el.id !== id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout activeTab="elections">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Élections</h1>
          <p className="text-gray-600 mt-1">Créez et gérez vos scrutins électoraux</p>
        </div>
        <button
          onClick={handleCreateElection}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Créer une élection
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">{elections.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Vote className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp size={14} className="mr-1" />
            Toutes les élections
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-gray-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-gray-600">
                {elections.filter((e) => e.statut === "Brouillon").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Publiées</p>
              <p className="text-2xl font-bold text-purple-600">
                {elections.filter((e) => e.statut === "Publiée").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">En cours</p>
              <p className="text-2xl font-bold text-green-600">
                {elections.filter((e) => e.statut === "En cours").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Clôturées</p>
              <p className="text-2xl font-bold text-red-600">
                {elections.filter((e) => e.statut === "Clôturée").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}{" "}
              <span className={`ml-1.5 ${activeTab === tab.id ? "opacity-90" : "opacity-60"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="text-[#1e3a5f]" size={20} />
          <h3 className="font-semibold text-gray-900">Recherche</h3>
        </div>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher une élection par titre ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">
              <strong>{filteredElections.length}</strong> résultat
              {filteredElections.length > 1 ? "s" : ""} trouvé
              {filteredElections.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Elections List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredElections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Vote className="text-blue-600" size={40} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune élection trouvée
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Essayez avec d'autres mots-clés ou modifiez vos filtres"
                    : "Commencez par créer votre première élection"}
                </p>
              </div>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Réinitialiser la recherche
                </button>
              ) : (
                <button
                  onClick={handleCreateElection}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Créer une élection
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredElections.map((election, index) => (
            <div
              key={election.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <Vote className="text-[#1e3a5f] flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{election.titre}</h3>
                      <span
                        className={`inline-block mt-2 px-3 py-1.5 text-xs font-bold rounded-lg border shadow-sm ${getStatusColor(
                          election.statut
                        )}`}
                      >
                        {election.statut}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 pl-8">{election.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ouverture</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(election.dateOuverture)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarCheck size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Clôture</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(election.dateCloture)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Participation</p>
                        <p className="font-medium text-gray-900">
                          {election.participationActuelle} / {election.nombreVotants}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {election.statut === "En cours" && (
                    <div className="mt-4 pl-8">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span className="font-medium">Taux de participation</span>
                        <span className="font-bold text-green-600">
                          {Math.round(
                            (election.participationActuelle / election.nombreVotants) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{
                            width: `${
                              (election.participationActuelle / election.nombreVotants) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {election.statut === "Brouillon" && (
                    <button
                      onClick={() => handlePublish(election.id)}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
                    >
                      <Play size={16} />
                      Publier
                    </button>
                  )}
                  {election.statut === "En cours" && (
                    <button
                      onClick={() => handleClose(election.id)}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
                    >
                      <StopCircle size={16} />
                      Clôturer
                    </button>
                  )}
                  <button
                    onClick={() => handleEditElection(election)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 border border-gray-200 font-medium"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(election.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-200 hover:border-red-300"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Vote className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingElection ? "Modifier l'élection" : "Nouvelle élection"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {editingElection
                        ? "Modifiez les informations de l'élection"
                        : "Créez une nouvelle élection pour votre organisation"}
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
                {!editingElection && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
                    <Info className="text-blue-600 flex-shrink-0" size={20} />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Création d'une élection</p>
                      <p className="text-blue-700">
                        L'élection sera créée en mode <strong>Brouillon</strong>. Vous pourrez
                        ajouter des candidats avant de la publier.
                      </p>
                    </div>
                  </div>
                )}

                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de l'élection <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Vote className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      placeholder="Ex: Élection du Président de l'Université"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Titre clair et descriptif de l'élection
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description{" "}
                    <span className="text-gray-400 text-xs font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="text-gray-400" size={20} />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez l'objet de cette élection, les enjeux et le contexte...&#10;&#10;Exemple:&#10;Élection du président de l'université pour le mandat 2026-2030. Les candidats présenteront leur vision pour le développement de l'établissement."
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white resize-none"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Cette description sera visible par tous les électeurs
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date et heure d'ouverture
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="datetime-local"
                        value={formData.dateOuverture}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOuverture: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      Début du scrutin
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date et heure de clôture
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarCheck className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="datetime-local"
                        value={formData.dateCloture}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateCloture: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      Fin du scrutin
                    </p>
                  </div>
                </div>

                {/* Note importante */}
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={18} />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Dates importantes</p>
                    <p>
                      Les dates peuvent être modifiées tant que l'élection est en{" "}
                      <strong>Brouillon</strong>. Une fois publiée et le scrutin ouvert, les dates
                      ne pourront plus être changées.
                    </p>
                  </div>
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
                  {editingElection ? "Mettre à jour" : "Créer l'élection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Elections;
