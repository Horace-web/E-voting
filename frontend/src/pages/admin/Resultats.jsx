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
  Filter,
} from "lucide-react";
import resultService from "../../services/result.service";
import { normalizeApiResponse } from "../../utils/api-utils";
import "../../pages/Admin.css";

const getInitials = (name = "?") =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";

function Resultats() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setLoading(true);
      const response = await resultService.getAll();
      const electionsData = normalizeApiResponse(response);
      setElections(electionsData);
      if (electionsData.length > 0) {
        setSelectedElection(electionsData[0]);
      }
    } catch (error) {
      console.warn("Erreur chargement résultats:", error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  const totalElecteurs = Number(selectedElection?.total_electeurs || 0);
  const totalVotes = Number(selectedElection?.total_votes || 0);
  const tauxParticipation = totalElecteurs > 0 ? ((totalVotes / totalElecteurs) * 100).toFixed(1) : "0.0";
  const gagnant = selectedElection?.candidats?.length > 0
    ? selectedElection.candidats.reduce((prev, curr) => (prev.votes > curr.votes ? prev : curr))
    : null;

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!selectedElection) return;
    try {
      const blob = await resultService.exportPDF(selectedElection.id);
      downloadBlob(blob, `resultats_${selectedElection.titre || selectedElection.id}.pdf`);
    } catch (error) {
      console.warn("Export PDF indisponible:", error);
      alert("L'export PDF a échoué pour cette élection.");
    }
  };

  const exportCSV = async () => {
    if (!selectedElection) return;
    try {
      const blob = await resultService.exportCSV(selectedElection.id);
      downloadBlob(blob, `resultats_${selectedElection.titre || selectedElection.id}.csv`);
    } catch (error) {
      console.warn("Export CSV indisponible, fallback local:", error);
      const headers = ["Candidat", "Votes", "Pourcentage"];
      const rows = (selectedElection?.candidats || []).map((c) => [
        c.nom,
        c.votes,
        `${c.pourcentage || 0}%`,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadBlob(new Blob([csv], { type: "text/csv" }), `resultats_${selectedElection.titre || selectedElection.id}.csv`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-gray-600">Chargement des résultats...</span>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat disponible</h3>
            <p className="text-gray-600">Les résultats des élections clôturées apparaîtront ici</p>
          </div>
        ) : (
          <>
            <div className="admin-header">
              <div>
                <h1>Résultats des élections</h1>
                <p className="text-gray-600">Consultez et publiez les résultats des scrutins clôturés</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 hover:shadow-md transition-all" disabled={!selectedElection}>
                  <Download size={20} />
                  Export CSV
                </button>
                <button onClick={exportPDF} className="btn-primary flex items-center gap-2 hover:shadow-md transition-all" disabled={!selectedElection}>
                  <FileText size={20} />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="text-[#1e3a5f]" size={20} />
                <label className="text-sm font-semibold text-gray-900">Sélectionner une élection</label>
              </div>
              <div className="relative">
                <Vote className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all bg-white appearance-none cursor-pointer font-medium"
                  value={selectedElection?.id || ""}
                  onChange={(e) => setSelectedElection(elections.find((el) => String(el.id) === e.target.value))}
                >
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.titre} - {formatDate(election.date_cloture)}
                      {election.publie ? " • Publié" : " • Non publié"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Électeurs inscrits</p>
                    <p className="text-2xl font-bold text-blue-600">{totalElecteurs.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Votes exprimés</p>
                    <p className="text-2xl font-bold text-green-600">{totalVotes.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Vote className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Participation</p>
                    <p className="text-2xl font-bold text-purple-600">{tauxParticipation}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Gagnant</p>
                    <p className="text-lg font-bold text-amber-600 truncate" title={gagnant?.nom || "En attente"}>{gagnant?.nom || "En attente"}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Trophy className="text-amber-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{gagnant?.votes || 0} votes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    Répartition des votes
                  </h2>
                  <button onClick={() => setShowDetails(!showDetails)} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all font-medium">
                    {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showDetails ? "Masquer détails" : "Afficher détails"}
                  </button>
                </div>

                <div className="space-y-6">
                  {(selectedElection?.candidats || [])
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidat, index) => {
                      const pourcentage = Number(candidat.pourcentage ?? (totalVotes > 0 ? (candidat.votes / totalVotes) * 100 : 0)).toFixed(1);
                      const isWinner = gagnant && candidat.id === gagnant.id;

                      return (
                        <div key={candidat.id || index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {candidat.photo ? (
                                  <img src={candidat.photo} alt={candidat.nom} className={`w-12 h-12 rounded-full object-cover shadow-md ${isWinner ? "ring-4 ring-amber-400" : "ring-2 ring-gray-200"}`} />
                                ) : (
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1e3a5f]/10 text-[#1e3a5f] font-bold shadow-md ${isWinner ? "ring-4 ring-amber-400" : "ring-2 ring-gray-200"}`}>
                                    {getInitials(candidat.nom)}
                                  </div>
                                )}
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
                                {showDetails && <span className="text-xs text-gray-500 font-medium">Position #{index + 1}</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-xl text-gray-900">{pourcentage}%</span>
                              {showDetails && <span className="text-sm text-gray-500 block font-medium">{candidat.votes || 0} votes</span>}
                            </div>
                          </div>

                          <div className="h-10 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                            <div className={`h-full ${barColors[index % barColors.length]} rounded-lg transition-all duration-700 flex items-center justify-end pr-4 shadow-sm`} style={{ width: `${pourcentage}%` }}>
                              {parseFloat(pourcentage) > 5 && <span className="text-white text-sm font-bold">{pourcentage}%</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[#1e3a5f]" />
                    Informations
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Titre</span>
                      <span className="font-semibold text-gray-900">{selectedElection?.titre || "Sans titre"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Clôturée le</span>
                      <span className="font-bold text-blue-700">{selectedElection?.date_cloture ? new Date(selectedElection.date_cloture).toLocaleDateString("fr-FR") : "Non défini"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Candidats</span>
                      <span className="font-bold text-purple-700">{selectedElection?.candidats?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Abstention</span>
                      <span className="font-bold text-red-700">{Math.max(totalElecteurs - totalVotes, 0).toLocaleString()} ({(100 - parseFloat(tauxParticipation)).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold mb-4">Statut de publication</h3>
                  <div className={`p-4 rounded-xl mb-4 border-2 ${selectedElection?.publie ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                    {selectedElection?.publie ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Eye className="text-green-600" size={20} /></div>
                        <div>
                          <p className="font-bold text-green-800">Résultats publics</p>
                          <p className="text-sm text-green-600">Visibles par tous les électeurs</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><EyeOff className="text-gray-600" size={20} /></div>
                        <div>
                          <p className="font-bold text-gray-800">Résultats privés</p>
                          <p className="text-sm text-gray-600">Visibles uniquement côté administration</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold mb-4">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-blue-300" disabled>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Share2 size={16} className="text-blue-600" /></div>
                      <span>Partager les résultats</span>
                    </button>
                    <button onClick={exportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-purple-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-purple-300" disabled={!selectedElection}>
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><FileText size={16} className="text-purple-600" /></div>
                      <span>Générer rapport PDF</span>
                    </button>
                    <button onClick={exportCSV} className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-green-50 transition-all font-medium text-gray-700 border border-gray-200 hover:border-green-300" disabled={!selectedElection}>
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Download size={16} className="text-green-600" /></div>
                      <span>Télécharger données CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default Resultats;
