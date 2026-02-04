import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ElecteurLayout from "../../components/ElecteurLayout";
import {
  Vote,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  X,
  Award,
  Shield,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";
import voteService from "../../services/vote.service";
import config from "../../config/app.config";

const ElecteurVoteNew = () => {
  const { electionId } = useParams();
  const [elections] = useState([
    {
      id: 1,
      titre: "Élection du Bureau des Étudiants 2026",
      description:
        "Votez pour élire le nouveau bureau des étudiants qui vous représentera pour l'année 2026.",
      dateDebut: "2026-02-01",
      dateFin: "2026-02-10",
      hasVoted: false,
      candidats: [
        {
          id: 1,
          nom: "Martin",
          prenom: "Sophie",
          photo: null,
          programme: "Améliorer la vie étudiante avec plus d'événements culturels et sportifs.",
          parti: "Union Étudiante",
        },
        {
          id: 2,
          nom: "Dubois",
          prenom: "Lucas",
          photo: null,
          programme: "Défendre les droits des étudiants et améliorer les conditions d'études.",
          parti: "Mouvement Étudiant",
        },
        {
          id: 3,
          nom: "Bernard",
          prenom: "Emma",
          photo: null,
          programme: "Créer plus de partenariats avec les entreprises pour les stages.",
          parti: "Avenir Étudiant",
        },
        {
          id: 4,
          nom: "Petit",
          prenom: "Thomas",
          photo: null,
          programme: "Rendre le campus plus écologique et durable.",
          parti: "Étudiants Verts",
        },
      ],
    },
    {
      id: 2,
      titre: "Représentants de promotion L3 Info",
      description: "Élisez vos représentants de promotion pour l'année universitaire.",
      dateDebut: "2026-01-28",
      dateFin: "2026-02-05",
      hasVoted: true,
      candidats: [
        {
          id: 5,
          nom: "Leroy",
          prenom: "Julie",
          photo: null,
          programme: "Être à l'écoute des étudiants et faire remonter leurs préoccupations.",
          parti: null,
        },
        {
          id: 6,
          nom: "Moreau",
          prenom: "Antoine",
          photo: null,
          programme: "Organiser des sessions d'entraide et de révision collective.",
          parti: null,
        },
        {
          id: 7,
          nom: "Garcia",
          prenom: "Maria",
          photo: null,
          programme: "Améliorer la communication entre les étudiants et l'administration.",
          parti: null,
        },
      ],
    },
  ]);

  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (electionId) {
      const election = elections.find((e) => e.id === parseInt(electionId));
      setSelectedElection(election || null);
    }
  }, [electionId, elections]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeRemaining = (dateFin) => {
    const now = new Date();
    const end = new Date(dateFin);
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Terminée";
    if (days === 1) return "1 jour restant";
    return `${days} jours restants`;
  };

  const handleVote = () => {
    setShowConfirmModal(true);
  };

  const confirmVote = async () => {
    setIsVoting(true);

    try {
      if (config.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] Vote enregistré:", {
          electionId: selectedElection.id,
          candidateId: selectedCandidat.id,
        });
      } else {
        await voteService.submit(selectedElection.id, selectedCandidat.id);
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement du vote");
      setShowConfirmModal(false);
    } finally {
      setIsVoting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.href = "/electeur";
  };

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ""}${nom?.charAt(0) || ""}`.toUpperCase();
  };

  // Vue liste des élections
  if (!selectedElection) {
    return (
      <ElecteurLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Vote className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-[#f59e0b] font-medium text-sm">Voter</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Élections disponibles</h1>
              <p className="text-white/70">
                Sélectionnez une élection pour exprimer votre vote en toute sécurité
              </p>
            </div>
          </div>

          {/* Liste des élections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <div
                key={election.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Barre de statut */}
                <div
                  className={`h-1.5 ${
                    election.hasVoted
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                      : "bg-gradient-to-r from-[#1e3a5f] to-[#f59e0b]"
                  }`}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#1e3a5f] transition-colors">
                      {election.titre}
                    </h3>
                    {election.hasVoted ? (
                      <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Voté
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-[#f59e0b]/10 text-[#d97706] rounded-full text-sm font-semibold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {getTimeRemaining(election.dateFin)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">{election.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-5">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 text-[#1e3a5f]" />
                      {formatDate(election.dateDebut)} - {formatDate(election.dateFin)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-[#f59e0b]" /> {election.candidats.length}{" "}
                      candidats
                    </span>
                  </div>

                  {!election.hasVoted ? (
                    <Link
                      to={`/electeur/vote/${election.id}`}
                      className="w-full py-3.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-xl font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Vote className="w-5 h-5" /> Voter maintenant
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <Link
                      to={`/electeur/resultats`}
                      className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Award className="w-5 h-5" /> Voir les résultats
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {elections.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucune élection disponible</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Il n'y a pas d'élection ouverte pour le moment. Revenez bientôt !
              </p>
            </div>
          )}
        </div>
      </ElecteurLayout>
    );
  }

  // Vue de vote pour une élection
  return (
    <ElecteurLayout>
      <div className="space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center gap-4">
          <Link
            to="/electeur/vote"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#1e3a5f] hover:border-[#1e3a5f] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedElection.titre}</h1>
            <p className="text-gray-500 text-sm">{selectedElection.description}</p>
          </div>
        </div>

        {/* Vérification si déjà voté */}
        {selectedElection.hasVoted ? (
          <div className="bg-gradient-to-r from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-3">Vous avez déjà voté</h2>
            <p className="text-emerald-600 mb-8 max-w-md mx-auto">
              Votre vote a été enregistré avec succès pour cette élection. Merci pour votre
              participation !
            </p>
            <Link
              to="/electeur/resultats"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Award className="w-5 h-5" /> Voir les résultats
            </Link>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-white border border-[#1e3a5f]/20 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-[#1e3a5f]" />
              </div>
              <div>
                <p className="text-[#1e3a5f] font-semibold mb-1">Vote sécurisé et anonyme</p>
                <p className="text-gray-600 text-sm">
                  Sélectionnez un candidat puis confirmez votre choix. Votre vote est chiffré et ne
                  peut pas être modifié après confirmation.
                </p>
              </div>
            </div>

            {/* Liste des candidats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {selectedElection.candidats.map((candidat) => (
                <div
                  key={candidat.id}
                  onClick={() => setSelectedCandidat(candidat)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedCandidat?.id === candidat.id
                      ? "border-[#1e3a5f] bg-gradient-to-br from-[#1e3a5f]/5 to-white shadow-lg ring-4 ring-[#1e3a5f]/10"
                      : "border-gray-200 bg-white hover:border-[#f59e0b]/50 hover:shadow-md"
                  }`}
                >
                  {/* Badge sélectionné */}
                  {selectedCandidat?.id === candidat.id && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                        selectedCandidat?.id === candidat.id
                          ? "bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] text-white shadow-lg"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                      }`}
                    >
                      {candidat.photo ? (
                        <img
                          src={candidat.photo}
                          alt={candidat.nom}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        getInitials(candidat.prenom, candidat.nom)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {candidat.prenom} {candidat.nom}
                      </h3>
                      {candidat.parti && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f59e0b]/10 text-[#d97706] rounded-full text-xs font-semibold mt-1">
                          <Sparkles className="w-3 h-3" />
                          {candidat.parti}
                        </span>
                      )}
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {candidat.programme}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton voter */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleVote}
                disabled={!selectedCandidat}
                className={`px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-200 ${
                  selectedCandidat
                    ? "bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white hover:from-[#152d47] hover:to-[#1e3a5f] shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Vote className="w-6 h-6" />
                Confirmer mon vote
                {selectedCandidat && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </>
        )}

        {/* Modal de confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Confirmer votre vote</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-white rounded-xl p-5 mb-6 border border-[#1e3a5f]/10">
                <p className="text-sm text-gray-500 mb-3">Vous allez voter pour :</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-xl flex items-center justify-center text-white font-bold">
                    {getInitials(selectedCandidat?.prenom, selectedCandidat?.nom)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {selectedCandidat?.prenom} {selectedCandidat?.nom}
                    </p>
                    {selectedCandidat?.parti && (
                      <p className="text-[#d97706] text-sm font-medium">{selectedCandidat.parti}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#92400e]">
                  <strong>Attention :</strong> Votre vote est définitif et ne pourra pas être
                  modifié après confirmation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmVote}
                  disabled={isVoting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-xl font-semibold hover:from-[#152d47] hover:to-[#1e3a5f] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isVoting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de succès */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-10 shadow-2xl text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Vote enregistré !</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Votre vote a été enregistré avec succès et de manière sécurisée. Merci pour votre
                participation !
              </p>
              <button
                onClick={handleSuccessClose}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        )}
      </div>
    </ElecteurLayout>
  );
};

export default ElecteurVoteNew;
