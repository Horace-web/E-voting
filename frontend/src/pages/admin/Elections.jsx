import { useEffect, useMemo, useState } from "react";
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
  Filter,
  X,
  Loader2,
  Vote,
  FileText,
  CalendarCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import electionService from "../../services/election.service";
import { normalizeApiResponse } from "../../utils/api-utils";

const STATUS = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiee",
  PUBLISHED_ACCENT: "Publiee",
  RUNNING: "En cours",
  RUNNING_BACKEND: "EnCours",
  CLOSED: "Cloturee",
  CLOSED_BACKEND: "Cloturee",
};

const normalizeStatus = (value) => {
  if (!value) return STATUS.DRAFT;
  if (value === "EnCours") return STATUS.RUNNING;
  if (value === "Cloturee") return STATUS.CLOSED;
  return value;
};

const formatApiDateToInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

const formatInputToApi = (value) => {
  if (!value) return undefined;
  return `${value.replace("T", " ")}:00`;
};

const mapElection = (raw) => ({
  id: raw.id,
  titre: raw.titre || "Sans titre",
  description: raw.description || "",
  dateOuverture: raw.date_debut || "",
  dateCloture: raw.date_fin || "",
  statut: normalizeStatus(raw.statut),
  nombreCandidats: raw.nb_candidats || 0,
  nombreVotants: raw.nb_votants || raw.total_votants || 0,
  participationActuelle: raw.total_votes || raw.participation_actuelle || 0,
});

const getStatusColor = (statut) => {
  switch (statut) {
    case STATUS.DRAFT:
      return "bg-gray-100 text-gray-700 border-gray-200";
    case STATUS.PUBLISHED:
    case "Publiee":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case STATUS.RUNNING:
      return "bg-green-100 text-green-700 border-green-200";
    case STATUS.CLOSED:
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Non definie";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Non definie";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Elections = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [elections, setElections] = useState([]);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    dateOuverture: "",
    dateCloture: "",
  });

  const loadElections = async () => {
    try {
      setLoading(true);
      const response = await electionService.getAll();
      const list = normalizeApiResponse(response);
      setElections(list.map(mapElection));
    } catch (error) {
      console.error("Erreur chargement elections:", error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const tabs = useMemo(
    () => [
      { id: "all", label: "Toutes", count: elections.length },
      {
        id: "brouillon",
        label: "Brouillons",
        count: elections.filter((e) => e.statut === STATUS.DRAFT).length,
      },
      {
        id: "publiee",
        label: "Publiees",
        count: elections.filter((e) => [STATUS.PUBLISHED, "Publiee"].includes(e.statut)).length,
      },
      {
        id: "encours",
        label: "En cours",
        count: elections.filter((e) => e.statut === STATUS.RUNNING).length,
      },
      {
        id: "cloturee",
        label: "Cloturees",
        count: elections.filter((e) => e.statut === STATUS.CLOSED).length,
      },
    ],
    [elections]
  );

  const filteredElections = elections.filter((election) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      election.titre.toLowerCase().includes(search) || election.description.toLowerCase().includes(search);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "brouillon") return matchesSearch && election.statut === STATUS.DRAFT;
    if (activeTab === "publiee") return matchesSearch && [STATUS.PUBLISHED, "Publiee"].includes(election.statut);
    if (activeTab === "encours") return matchesSearch && election.statut === STATUS.RUNNING;
    if (activeTab === "cloturee") return matchesSearch && election.statut === STATUS.CLOSED;
    return matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      dateOuverture: "",
      dateCloture: "",
    });
  };

  const handleCreateElection = () => {
    setEditingElection(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditElection = (election) => {
    setEditingElection(election);
    setFormData({
      titre: election.titre,
      description: election.description,
      dateOuverture: formatApiDateToInput(election.dateOuverture),
      dateCloture: formatApiDateToInput(election.dateCloture),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      titre: formData.titre,
      description: formData.description || undefined,
      date_debut: formatInputToApi(formData.dateOuverture),
      date_fin: formatInputToApi(formData.dateCloture),
    };

    try {
      if (editingElection) {
        await electionService.update(editingElection.id, payload);
      } else {
        await electionService.create(payload);
      }
      await loadElections();
      setShowModal(false);
      setEditingElection(null);
      resetForm();
    } catch (error) {
      console.error("Erreur sauvegarde election:", error);
      alert(error.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await electionService.publish(id);
      await loadElections();
    } catch (error) {
      console.error("Erreur publication:", error);
      const message = error.response?.data?.message || "Erreur lors de la publication";
      const normalized = message.toLowerCase();

      if (normalized.includes("deux candidat") || normalized.includes("2 candidat")) {
        alert("Ajoutez au moins deux candidats avant de publier cette election.");
        return;
      }

      alert(message);
    }
  };
  const handleClose = async (id) => {
    try {
      await electionService.close(id);
      await loadElections();
    } catch (error) {
      console.error("Erreur cloture:", error);
      alert(error.response?.data?.message || "Erreur lors de la cloture");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Etes-vous sur de vouloir supprimer cette election ?")) return;

    try {
      await electionService.delete(id);
      await loadElections();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout activeTab="elections">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Elections</h1>
          <p className="text-gray-600 mt-1">Creez et gerez vos scrutins electoraux</p>
        </div>
        <button
          onClick={handleCreateElection}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Creer une election
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">{elections.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Vote className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-gray-600">
                {elections.filter((e) => e.statut === STATUS.DRAFT).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Publiees</p>
              <p className="text-2xl font-bold text-purple-600">
                {elections.filter((e) => [STATUS.PUBLISHED, "Publiee"].includes(e.statut)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">En cours</p>
              <p className="text-2xl font-bold text-green-600">
                {elections.filter((e) => e.statut === STATUS.RUNNING).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Cloturees</p>
              <p className="text-2xl font-bold text-red-600">
                {elections.filter((e) => e.statut === STATUS.CLOSED).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

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
              {tab.label} <span className="ml-1.5 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

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
            placeholder="Rechercher une election..."
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
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <Loader2 className="animate-spin mx-auto text-[#1e3a5f]" size={28} />
            <p className="text-gray-600 mt-3">Chargement des elections...</p>
          </div>
        )}

        {!loading && filteredElections.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Vote className="text-blue-600" size={40} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune election trouvee</h3>
                <p className="text-gray-600">Commencez par creer votre premiere election.</p>
              </div>
            </div>
          </div>
        )}

        {!loading &&
          filteredElections.map((election) => (
            <div
              key={election.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                        <p className="font-medium text-gray-900">{formatDate(election.dateOuverture)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarCheck size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cloture</p>
                        <p className="font-medium text-gray-900">{formatDate(election.dateCloture)}</p>
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
                </div>

                <div className="flex flex-wrap gap-2">
                  {election.statut === STATUS.DRAFT && (
                    <button
                      onClick={() => handlePublish(election.id)}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
                    >
                      <Play size={16} />
                      Publier
                    </button>
                  )}
                  {election.statut === STATUS.RUNNING && (
                    <button
                      onClick={() => handleClose(election.id)}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
                    >
                      <StopCircle size={16} />
                      Cloturer
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
          ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Vote className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingElection ? "Modifier l'election" : "Nouvelle election"}
                    </h2>
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de l'election <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date et heure d'ouverture
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateOuverture}
                      onChange={(e) => setFormData({ ...formData, dateOuverture: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date et heure de cloture
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateCloture}
                      onChange={(e) => setFormData({ ...formData, dateCloture: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

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
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
                >
                  {submitting
                    ? "Enregistrement..."
                    : editingElection
                      ? "Mettre a jour"
                      : "Creer l'election"}
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
