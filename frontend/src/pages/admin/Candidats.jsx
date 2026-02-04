import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Search, Plus, Edit2, Trash2, Upload, X, Filter, Loader2 } from "lucide-react";
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

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un candidat..."
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
            </div>
          </div>
        </div>

        {/* Grille de candidats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidatsFiltres.map((candidat) => (
            <div
              key={candidat.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Photo et badge élection */}
                <div className="flex justify-between items-start mb-4">
                  <img
                    src={candidat.photo_url}
                    alt={candidat.nom}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                  />
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #{candidat.ordre_affichage}
                  </span>
                </div>

                {/* Informations */}
                <h3 className="font-semibold text-lg mb-2">{candidat.nom}</h3>
                <p className="text-sm text-gray-500 mb-3">{candidat.election_titre}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{candidat.programme}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => openEditModal(candidat)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(candidat.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {candidatsFiltres.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Aucun candidat trouvé</p>
          </div>
        )}

        {/* Modal Création/Édition */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalMode === "create" ? "Ajouter un candidat" : "Modifier le candidat"}
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
                  {/* Élection */}
                  <div className="form-group">
                    <label className="form-label">Élection *</label>
                    <select
                      name="election_id"
                      className="input-field"
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
                  </div>

                  {/* Nom */}
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

                  {/* Photo */}
                  <div className="form-group">
                    <label className="form-label">Photo du candidat</label>
                    <div className="flex items-center gap-4">
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="Aperçu"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      )}
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {photoPreview ? "Changer la photo" : "Télécharger une photo"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format recommandé: JPG, PNG (max 2MB)
                    </p>
                  </div>

                  {/* Programme */}
                  <div className="form-group">
                    <label className="form-label">Programme électoral *</label>
                    <textarea
                      name="programme"
                      className="input-field"
                      value={formData.programme}
                      onChange={handleInputChange}
                      placeholder="Décrivez le programme et les objectifs du candidat..."
                      rows="5"
                      required
                    />
                  </div>

                  {/* Ordre d'affichage */}
                  <div className="form-group">
                    <label className="form-label">Ordre d'affichage *</label>
                    <input
                      type="number"
                      name="ordre_affichage"
                      className="input-field"
                      value={formData.ordre_affichage}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Définit l'ordre d'apparition sur le bulletin de vote
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
