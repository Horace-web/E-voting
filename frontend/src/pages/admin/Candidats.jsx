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
  Loader2,
  UserCircle,
  Award,
  FileText,
  Hash,
  Image,
  Info,
  AlertCircle,
  Users,
  Vote,
  TrendingUp,
  Layers,
} from "lucide-react";
import candidateService from "../../services/candidate.service";
import electionService from "../../services/election.service";
import config from "../../config/app.config";
import "../../pages/Admin.css";

function Candidats() {
  // Mock data pour les élections
  const electionsDisponibles = [
    { id: "1", titre: "Élection Présidentielle 2026" },
    { id: "2", titre: "Élection des Représentants" },
    { id: "3", titre: "Conseil Étudiant 2026" },
    { id: "4", titre: "Bureau BDE 2026" },
  ];

  // Mock data pour les candidats
  const [candidats, setCandidats] = useState([
    {
      id: "1",
      election_id: "1",
      election_titre: "Élection Présidentielle 2026",
      nom: "DOHOU Ercias Audrey",
      photo_url:
        "https://ui-avatars.com/api/?name=Ercias+Dohou&background=3b82f6&color=fff&size=200",
      programme:
        "Programme axé sur l'innovation numérique et la modernisation des infrastructures universitaires.",
      ordre_affichage: 1,
      nb_votes: 0,
    },
    {
      id: "2",
      election_id: "1",
      election_titre: "Élection Présidentielle 2026",
      nom: "HOUNDETON Jeffry",
      photo_url:
        "https://ui-avatars.com/api/?name=Jeffry+Houndeton&background=10b981&color=fff&size=200",
      programme:
        "Engagement pour une meilleure qualité de vie étudiante et des services améliorés.",
      ordre_affichage: 2,
      nb_votes: 0,
    },
    {
      id: "3",
      election_id: "2",
      election_titre: "Élection des Représentants",
      nom: "SOGOE Bryan",
      photo_url:
        "https://ui-avatars.com/api/?name=Bryan+Sogoe&background=8b5cf6&color=fff&size=200",
      programme: "Représentation active et transparente des intérêts étudiants.",
      ordre_affichage: 1,
      nb_votes: 0,
    },
    {
      id: "4",
      election_id: "2",
      election_titre: "Élection des Représentants",
      nom: "ODOUNLAMI Horace",
      photo_url:
        "https://ui-avatars.com/api/?name=Horace+Odounlami&background=f59e0b&color=fff&size=200",
      programme: "Leadership participatif et développement des activités culturelles.",
      ordre_affichage: 2,
      nb_votes: 0,
    },
  ]);

  const [filtreElection, setFiltreElection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    election_id: "",
    nom: "",
    photo_url: "",
    programme: "",
    ordre_affichage: 1,
  });

  // Filtrage des candidats
  const candidatsFiltres = candidats.filter((candidat) => {
    const matchElection = filtreElection === "all" || candidat.election_id === filtreElection;
    const matchSearch =
      candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.election_titre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchElection && matchSearch;
  });

  // Statistiques
  const stats = {
    total: candidats.length,
    parElection: electionsDisponibles.reduce((acc, election) => {
      acc[election.id] = candidats.filter((c) => c.election_id === election.id).length;
      return acc;
    }, {}),
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          photo_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      election_id: "",
      nom: "",
      photo_url: "",
      programme: "",
      ordre_affichage: 1,
    });
    setPhotoPreview(null);
    setSelectedCandidat(null);
    setShowModal(true);
  };

  const openEditModal = (candidat) => {
    setModalMode("edit");
    setSelectedCandidat(candidat);
    setFormData({
      election_id: candidat.election_id,
      nom: candidat.nom,
      photo_url: candidat.photo_url,
      programme: candidat.programme,
      ordre_affichage: candidat.ordre_affichage,
    });
    setPhotoPreview(candidat.photo_url);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const electionSelectionnee = electionsDisponibles.find((e) => e.id === formData.election_id);

    if (modalMode === "create") {
      const nouveauCandidat = {
        id: Date.now().toString(),
        ...formData,
        election_titre: electionSelectionnee?.titre || "",
        nb_votes: 0,
      };
      setCandidats([...candidats, nouveauCandidat]);
    } else {
      setCandidats(
        candidats.map((c) =>
          c.id === selectedCandidat.id
            ? { ...c, ...formData, election_titre: electionSelectionnee?.titre || "" }
            : c
        )
      );
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
      setCandidats(candidats.filter((c) => c.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Gestion des Candidats</h1>
            <p className="text-gray-600">
              {stats.total} candidat{stats.total > 1 ? "s" : ""} au total
            </p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={20} />
            Ajouter un candidat
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Candidats</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp size={14} className="mr-1" />
              Tous les candidats
            </div>
          </div>

          {electionsDisponibles.slice(0, 3).map((election, idx) => {
            const colors = [
              { border: "border-purple-500", bg: "bg-purple-100", text: "text-purple-600" },
              { border: "border-green-500", bg: "bg-green-100", text: "text-green-600" },
              { border: "border-amber-500", bg: "bg-amber-100", text: "text-amber-600" },
            ];
            const color = colors[idx];
            const count = stats.parElection[election.id] || 0;

            return (
              <div
                key={election.id}
                className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color.border} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium text-gray-600 mb-1 truncate"
                      title={election.titre}
                    >
                      {election.titre.length > 20
                        ? election.titre.substring(0, 20) + "..."
                        : election.titre}
                    </p>
                    <p className={`text-2xl font-bold ${color.text}`}>{count}</p>
                  </div>
                  <div
                    className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center`}
                  >
                    <Vote className={color.text} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-[#1e3a5f]" size={20} />
            <h3 className="font-semibold text-gray-900">Filtres et recherche</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un candidat par nom..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Vote
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                value={filtreElection}
                onChange={(e) => setFiltreElection(e.target.value)}
              >
                <option value="all">Toutes les élections</option>
                {electionsDisponibles.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.titre} ({stats.parElection[election.id] || 0})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          {(searchTerm || filtreElection !== "all") && (
            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">
                <strong>{candidatsFiltres.length}</strong> candidat
                {candidatsFiltres.length > 1 ? "s" : ""} trouvé
                {candidatsFiltres.length > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFiltreElection("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <X size={16} />
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* Grille de candidats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidatsFiltres.map((candidat, index) => (
            <div
              key={candidat.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Badge ordre en haut à droite */}
              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-lg shadow-lg">
                    <Hash size={12} />
                    {candidat.ordre_affichage}
                  </div>
                </div>

                {/* Photo avec gradient overlay */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <img
                    src={candidat.photo_url}
                    alt={candidat.nom}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div className="p-6">
                {/* Informations */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <Award size={18} className="text-blue-600" />
                    {candidat.nom}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Vote size={14} className="text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">{candidat.election_titre}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 line-clamp-3">{candidat.programme}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} />
                    <span className="font-semibold">{candidat.nb_votes}</span> vote
                    {candidat.nb_votes > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(candidat)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(candidat.id)}
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

        {candidatsFiltres.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Award className="text-blue-600" size={40} />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-lg">Aucun candidat trouvé</p>
                <p className="text-gray-500 text-sm mt-1">
                  {searchTerm || filtreElection !== "all"
                    ? "Essayez de modifier vos filtres de recherche"
                    : "Commencez par ajouter un nouveau candidat"}
                </p>
              </div>
              {searchTerm || filtreElection !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFiltreElection("all");
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={openCreateModal}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter un candidat
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Création/Édition */}
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
                      <Award className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {modalMode === "create" ? "Ajouter un candidat" : "Modifier le candidat"}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {modalMode === "create"
                          ? "Enregistrez un nouveau candidat dans le système"
                          : "Modifiez les informations du candidat"}
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
                        <p className="font-semibold text-blue-900 mb-1">Ajout d'un candidat</p>
                        <p className="text-blue-700">
                          Le candidat sera visible sur le bulletin de vote une fois l'élection
                          publiée.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Élection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Élection <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Award className="text-gray-400" size={20} />
                      </div>
                      <select
                        name="election_id"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                        value={formData.election_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une élection</option>
                        {electionsDisponibles.map((election) => (
                          <option key={election.id} value={election.id}>
                            {election.titre}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Sélectionnez l'élection à laquelle le candidat participe
                    </p>
                  </div>

                  {/* Nom complet */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="text-gray-400" size={20} />
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
                      Nom complet du candidat tel qu'il apparaîtra sur le bulletin
                    </p>
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Photo du candidat
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {photoPreview && (
                        <div className="relative group">
                          <img
                            src={photoPreview}
                            alt="Aperçu"
                            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all flex items-center justify-center">
                            <Image
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              size={24}
                            />
                          </div>
                        </div>
                      )}
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Upload size={28} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {photoPreview ? "Changer la photo" : "Télécharger une photo"}
                        </span>
                        <span className="text-xs text-gray-500">JPG, PNG (max 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Une photo professionnelle améliore la présentation du candidat
                    </p>
                  </div>

                  {/* Programme électoral */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Programme électoral <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText className="text-gray-400" size={20} />
                      </div>
                      <textarea
                        name="programme"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white resize-none"
                        value={formData.programme}
                        onChange={handleInputChange}
                        placeholder="Décrivez le programme et les objectifs du candidat...&#10;&#10;Exemples:&#10;• Amélioration des infrastructures&#10;• Programmes sociaux et culturels&#10;• Engagement pour la transparence"
                        rows="6"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Décrivez les engagements et objectifs principaux (min. 50 caractères)
                    </p>
                  </div>

                  {/* Ordre d'affichage */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordre d'affichage <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="number"
                        name="ordre_affichage"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white"
                        value={formData.ordre_affichage}
                        onChange={handleInputChange}
                        min="1"
                        max="99"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Position du candidat sur le bulletin de vote (1 = premier)
                    </p>
                  </div>

                  {/* Note importante */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={18} />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Ordre d'affichage</p>
                      <p>
                        Les candidats avec le même ordre d'affichage seront triés alphabétiquement.
                        Assurez-vous d'attribuer des numéros différents si l'ordre est important.
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
                    {modalMode === "create" ? "Créer le candidat" : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Candidats;
