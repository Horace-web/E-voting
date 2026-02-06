import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  BarChart3,
  Download,
  Eye,
  EyeOff,
  Users,
  Vote,
  TrendingUp,
  Calendar,
  Trophy,
  FileText,
  Share2,
  Loader2,
  Award,
  CheckCircle,
  Filter,
} from "lucide-react";
import resultService from "../../services/result.service";
import electionService from "../../services/election.service";
import config from "../../config/app.config";
import "../../pages/Admin.css";

function Resultats() {
  // Mock data pour les élections avec résultats
  const [elections] = useState([
    {
      id: "1",
      titre: "Élection Présidentielle 2025",
      date_cloture: "2025-12-15T18:00:00",
      total_electeurs: 1250,
      total_votes: 892,
      publie: true,
      candidats: [
        {
          id: "1",
          nom: "DOHOU Ercias Audrey",
          votes: 412,
          photo: "https://ui-avatars.com/api/?name=Ercias+Dohou&background=3b82f6&color=fff",
        },
        {
          id: "2",
          nom: "HOUNDETON Jeffry",
          votes: 298,
          photo: "https://ui-avatars.com/api/?name=Jeffry+Houndeton&background=10b981&color=fff",
        },
        {
          id: "3",
          nom: "SOGOE Bryan",
          votes: 182,
          photo: "https://ui-avatars.com/api/?name=Bryan+Sogoe&background=8b5cf6&color=fff",
        },
      ],
    },
    {
      id: "2",
      titre: "Élection des Représentants",
      date_cloture: "2026-01-20T17:00:00",
      total_electeurs: 850,
      total_votes: 623,
      publie: true,
      candidats: [
        {
          id: "4",
          nom: "ODOUNLAMI Horace",
          votes: 287,
          photo: "https://ui-avatars.com/api/?name=Horace+Odounlami&background=f59e0b&color=fff",
        },
        {
          id: "5",
          nom: "ADJOVI Marie",
          votes: 198,
          photo: "https://ui-avatars.com/api/?name=Marie+Adjovi&background=ec4899&color=fff",
        },
        {
          id: "6",
          nom: "KOUASSI Paul",
          votes: 138,
          photo: "https://ui-avatars.com/api/?name=Paul+Kouassi&background=6366f1&color=fff",
        },
      ],
    },
    {
      id: "3",
      titre: "Conseil Étudiant 2026",
      date_cloture: "2026-01-28T20:00:00",
      total_electeurs: 2100,
      total_votes: 1456,
      publie: false,
      candidats: [
        {
          id: "7",
          nom: "AKPO Jean",
          votes: 534,
          photo: "https://ui-avatars.com/api/?name=Jean+Akpo&background=14b8a6&color=fff",
        },
        {
          id: "8",
          nom: "GBEDO Sarah",
          votes: 489,
          photo: "https://ui-avatars.com/api/?name=Sarah+Gbedo&background=f43f5e&color=fff",
        },
        {
          id: "9",
          nom: "MENSAH David",
          votes: 433,
          photo: "https://ui-avatars.com/api/?name=David+Mensah&background=a855f7&color=fff",
        },
      ],
    },
  ]);

  const [selectedElection, setSelectedElection] = useState(elections[0]);
  const [showDetails, setShowDetails] = useState(true);

  // Calculs pour l'élection sélectionnée
  const tauxParticipation = (
    (selectedElection.total_votes / selectedElection.total_electeurs) *
    100
  ).toFixed(1);
  const gagnant = selectedElection.candidats.reduce((prev, curr) =>
    prev.votes > curr.votes ? prev : curr
  );
  const totalVotes = selectedElection.total_votes;

  // Toggle publication
  const togglePublication = (electionId) => {
    // Dans un vrai cas, appel API pour publier/dépublier
    alert(
      `Publication ${elections.find((e) => e.id === electionId)?.publie ? "retirée" : "activée"} pour cette élection`
    );
  };

  // Export PDF
  const exportPDF = () => {
    alert("Export PDF des résultats en cours...");
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Candidat", "Votes", "Pourcentage"];
    const rows = selectedElection.candidats.map((c) => [
      c.nom,
      c.votes,
      ((c.votes / totalVotes) * 100).toFixed(1) + "%",
    ]);

    const csv = [
      `Résultats: ${selectedElection.titre}`,
      `Date de clôture: ${new Date(selectedElection.date_cloture).toLocaleDateString("fr-FR")}`,
      `Taux de participation: ${tauxParticipation}%`,
      "",
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultats_${selectedElection.titre.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Couleurs pour les barres
  const barColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Résultats des Élections</h1>
            <p className="text-gray-600">
              Consultez et publiez les résultats des scrutins clôturés
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="btn-secondary flex items-center gap-2 hover:shadow-md transition-all"
            >
              <Download size={20} />
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              className="btn-primary flex items-center gap-2 hover:shadow-md transition-all"
            >
              <FileText size={20} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Sélecteur d'élection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="text-[#1e3a5f]" size={20} />
            <label className="text-sm font-semibold text-gray-900">Sélectionner une élection</label>
          </div>
          <div className="relative">
            <Vote
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer font-medium"
              value={selectedElection.id}
              onChange={(e) =>
                setSelectedElection(elections.find((el) => el.id === e.target.value))
              }
            >
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.titre} - {formatDate(election.date_cloture)}
                  {election.publie ? " ✓ Publié" : " (Non publié)"}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Électeurs inscrits</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedElection.total_electeurs.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Votes exprimés</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedElection.total_votes.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Vote className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Participation</p>
                <p className="text-2xl font-bold text-purple-600">{tauxParticipation}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${tauxParticipation}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Gagnant</p>
                <p className="text-lg font-bold text-amber-600 truncate" title={gagnant.nom}>
                  {gagnant.nom}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-amber-600" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{gagnant.votes} votes</p>
          </div>
        </div>

        {/* Résultats détaillés */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique à barres */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Répartition des votes
              </h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                {showDetails ? "Masquer détails" : "Afficher détails"}
              </button>
            </div>

            <div className="space-y-6">
              {selectedElection.candidats
                .sort((a, b) => b.votes - a.votes)
                .map((candidat, index) => {
                  const pourcentage = ((candidat.votes / totalVotes) * 100).toFixed(1);
                  const isWinner = candidat.id === gagnant.id;

                  return (
                    <div key={candidat.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={candidat.photo}
                              alt={candidat.nom}
                              className={`w-12 h-12 rounded-full object-cover shadow-md ${isWinner ? "ring-4 ring-amber-400" : "ring-2 ring-gray-200"}`}
                            />
                            {isWinner && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                <Trophy size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{candidat.nom}</span>
                              {index === 0 && <Trophy size={16} className="text-amber-500" />}
                            </div>
                            {showDetails && (
                              <span className="text-xs text-gray-500 font-medium">
                                Position #{index + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xl text-gray-900">{pourcentage}%</span>
                          {showDetails && (
                            <span className="text-sm text-gray-500 block font-medium">
                              {candidat.votes.toLocaleString()} votes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="h-10 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                        <div
                          className={`h-full ${barColors[index % barColors.length]} rounded-lg transition-all duration-700 flex items-center justify-end pr-4 shadow-sm`}
                          style={{ width: `${pourcentage}%` }}
                        >
                          {parseFloat(pourcentage) > 15 && (
                            <span className="text-white text-sm font-bold">{pourcentage}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Infos élection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#1e3a5f]" />
                Informations
              </h3>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 text-xs block mb-1">Titre</span>
                  <span className="font-semibold text-gray-900">{selectedElection.titre}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Clôturé le</span>
                  <span className="font-bold text-blue-700">
                    {new Date(selectedElection.date_cloture).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Candidats</span>
                  <span className="font-bold text-purple-700">
                    {selectedElection.candidats.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Abstention</span>
                  <span className="font-bold text-red-700">
                    {(
                      selectedElection.total_electeurs - selectedElection.total_votes
                    ).toLocaleString()}{" "}
                    ({(100 - parseFloat(tauxParticipation)).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Statut publication */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Statut de publication</h3>

              <div
                className={`p-4 rounded-xl mb-4 border-2 ${
                  selectedElection.publie
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedElection.publie ? (
                    <>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Eye className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-green-800">Résultats publics</p>
                        <p className="text-sm text-green-600">Visibles par tous les électeurs</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <EyeOff className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Résultats privés</p>
                        <p className="text-sm text-gray-600">Visibles uniquement par les admins</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => togglePublication(selectedElection.id)}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all shadow-sm hover:shadow-md ${
                  selectedElection.publie
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {selectedElection.publie ? "Retirer la publication" : "Publier les résultats"}
              </button>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Actions</h3>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-blue-300">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Share2 size={16} className="text-blue-600" />
                  </div>
                  <span>Partager les résultats</span>
                </button>
                <button
                  onClick={exportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-purple-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-purple-300"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-purple-600" />
                  </div>
                  <span>Générer rapport PDF</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-green-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-green-300"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Download size={16} className="text-green-600" />
                  </div>
                  <span>Télécharger données CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Resultats;
