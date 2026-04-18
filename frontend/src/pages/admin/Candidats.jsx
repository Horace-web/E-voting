import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Plus, Search, Trash2, Upload, X, Loader2, Users, Award, Image as ImageIcon } from "lucide-react";
import candidateService from "../../services/candidate.service";
import electionService from "../../services/election.service";
import { normalizeApiResponse } from "../../utils/api-utils";

const mapElection = (e) => ({
  id: String(e.id),
  titre: e.titre || "Sans titre",
});

const mapCandidate = (c, electionTitle) => ({
  id: String(c.id),
  nom: c.nom || "Sans nom",
  programme: c.programme || "",
  photo_url: c.photo_url || null,
  election_titre: electionTitle,
});

function Candidats() {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [candidats, setCandidats] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);
  const [loadingCandidats, setLoadingCandidats] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    programme: "",
    photo: null,
  });

  const loadElections = async () => {
    try {
      setLoadingElections(true);
      const response = await electionService.getAll();
      const list = normalizeApiResponse(response);
      const mapped = list.map(mapElection);
      setElections(mapped);

      if (mapped.length > 0 && !selectedElectionId) {
        setSelectedElectionId(mapped[0].id);
      }
    } catch (error) {
      console.error("Erreur chargement elections:", error);
      setElections([]);
    } finally {
      setLoadingElections(false);
    }
  };

  const loadCandidats = async (electionId) => {
    if (!electionId) {
      setCandidats([]);
      return;
    }

    try {
      setLoadingCandidats(true);
      const response = await electionService.getCandidates(electionId);
      const list = normalizeApiResponse(response);
      const electionTitle = elections.find((e) => e.id === electionId)?.titre || "Election";
      setCandidats(list.map((c) => mapCandidate(c, electionTitle)));
    } catch (error) {
      console.error("Erreur chargement candidats:", error);
      setCandidats([]);
    } finally {
      setLoadingCandidats(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      loadCandidats(selectedElectionId);
    }
  }, [selectedElectionId, elections.length]);

  const filteredCandidats = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return candidats.filter(
      (c) => c.nom.toLowerCase().includes(q) || c.programme.toLowerCase().includes(q)
    );
  }, [candidats, searchTerm]);

  const resetForm = () => {
    setFormData({ nom: "", programme: "", photo: null });
  };

  const openCreateModal = () => {
    if (!selectedElectionId) {
      alert("Selectionne d'abord une election.");
      return;
    }
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedElectionId) return;

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("election_id", selectedElectionId);
      fd.append("nom", formData.nom);
      if (formData.programme) fd.append("programme", formData.programme);
      if (formData.photo) fd.append("photo", formData.photo);

      await candidateService.createWithPhoto(fd);
      await loadCandidats(selectedElectionId);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erreur creation candidat:", error);
      alert(error.response?.data?.message || "Erreur lors de la creation du candidat");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce candidat ?")) return;

    try {
      await candidateService.delete(id);
      await loadCandidats(selectedElectionId);
    } catch (error) {
      console.error("Erreur suppression candidat:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout activeTab="candidats">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Candidats</h1>
          <p className="text-gray-600 mt-1">Ajoute et supprime les candidats par election</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Ajouter un candidat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total candidats</p>
          <p className="text-2xl font-bold text-blue-600">{candidats.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Elections chargees</p>
          <p className="text-2xl font-bold text-purple-600">{elections.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500">
          <p className="text-sm text-gray-600">Election selectionnee</p>
          <p className="text-sm font-semibold text-emerald-700 mt-1 truncate">
            {elections.find((e) => e.id === selectedElectionId)?.titre || "Aucune"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Election</label>
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              disabled={loadingElections}
            >
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.titre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un candidat"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loadingCandidats && (
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <Loader2 className="animate-spin mx-auto text-[#1e3a5f]" size={28} />
            <p className="text-gray-600 mt-3">Chargement des candidats...</p>
          </div>
        )}

        {!loadingCandidats && filteredCandidats.length === 0 && (
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <Users className="mx-auto text-gray-400" size={40} />
            <p className="text-gray-600 mt-3">Aucun candidat pour cette election.</p>
          </div>
        )}

        {!loadingCandidats &&
          filteredCandidats.map((candidat) => (
            <div key={candidat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    {candidat.photo_url ? (
                      <img src={candidat.photo_url} alt={candidat.nom} className="w-full h-full object-cover" />
                    ) : (
                      <Award className="text-gray-500" size={24} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{candidat.nom}</h3>
                    <p className="text-xs text-gray-500 truncate">{candidat.election_titre}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(candidat.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {candidat.programme && (
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">{candidat.programme}</p>
              )}
            </div>
          ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Nouveau candidat</h2>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white p-1">
                  <X size={22} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Programme</label>
                <textarea
                  rows={4}
                  value={formData.programme}
                  onChange={(e) => setFormData((prev) => ({ ...prev, programme: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo (optionnel)</label>
                <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-5 flex items-center gap-3 cursor-pointer hover:border-[#1e3a5f] transition-colors">
                  <Upload className="text-gray-500" size={20} />
                  <span className="text-sm text-gray-600 truncate">
                    {formData.photo ? formData.photo.name : "Choisir une image"}
                  </span>
                  <ImageIcon className="text-gray-400 ml-auto" size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        photo: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-semibold disabled:opacity-60"
                >
                  {submitting ? "Enregistrement..." : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Candidats;
