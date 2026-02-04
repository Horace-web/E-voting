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
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all"
        >
          <Plus size={20} />
          Créer une élection
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher une élection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Elections List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredElections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Filter className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune élection trouvée</h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Essayez avec d'autres mots-clés"
                : "Commencez par créer votre première élection"}
            </p>
          </div>
        ) : (
          filteredElections.map((election) => (
            <div
              key={election.id}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{election.titre}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        election.statut
                      )}`}
                    >
                      {election.statut}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{election.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Ouverture: {formatDate(election.dateOuverture)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Clôture: {formatDate(election.dateCloture)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} className="text-gray-400" />
                      <span>
                        {election.participationActuelle} / {election.nombreVotants} votes
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {election.statut === "En cours" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Participation</span>
                        <span>
                          {Math.round(
                            (election.participationActuelle / election.nombreVotants) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Play size={16} />
                      Publier
                    </button>
                  )}
                  {election.statut === "En cours" && (
                    <button
                      onClick={() => handleClose(election.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <StopCircle size={16} />
                      Clôturer
                    </button>
                  )}
                  <button
                    onClick={() => handleEditElection(election)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(election.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingElection ? "Modifier l'élection" : "Nouvelle élection"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'élection *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    placeholder="Ex: Élection du Président de l'Université"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez l'objet de cette élection..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date et heure d'ouverture
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateOuverture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOuverture: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date et heure de clôture
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateCloture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateCloture: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all"
                >
                  {editingElection ? "Mettre à jour" : "Créer"}
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
