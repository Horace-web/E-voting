import React, { useState } from "react";
import "./ElecteurVote.css";

const ElecteurVote = ({ election, onBack, onVoteSuccess }) => {
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [step, setStep] = useState("selection"); // selection, confirmation, success
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Données simulées des candidats
  const candidats = [
    {
      id: 1,
      nom: "Martin",
      prenom: "Sophie",
      photo: null,
      programme:
        "Améliorer la vie étudiante avec plus d'événements culturels et sportifs.",
      liste: "Ensemble pour l'Université",
    },
    {
      id: 2,
      nom: "Dubois",
      prenom: "Pierre",
      photo: null,
      programme:
        "Renforcer les partenariats avec les entreprises pour faciliter les stages.",
      liste: "Avenir Étudiant",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Marie",
      photo: null,
      programme:
        "Créer plus d'espaces de travail et améliorer les équipements numériques.",
      liste: "Innovation Campus",
    },
    {
      id: 4,
      nom: "Petit",
      prenom: "Lucas",
      photo: null,
      programme:
        "Développer les initiatives écologiques et le développement durable.",
      liste: "Campus Vert",
    },
    {
      id: 5,
      nom: "Robert",
      prenom: "Emma",
      photo: null,
      programme:
        "Favoriser l'inclusion et la diversité au sein de l'université.",
      liste: "Unis et Solidaires",
    },
  ];

  const handleSubmitVote = async () => {
    setIsSubmitting(true);
    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
    setIsSubmitting(false);
  };

  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`;
  };

  if (step === "success") {
    return (
      <div className="vote-page">
        <div className="vote-success">
          <div className="success-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Vote enregistré avec succès !</h2>
          <p>Votre vote a été enregistré de manière sécurisée et anonyme.</p>
          <p className="vote-ref">
            Référence de transaction :{" "}
            <strong>
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </strong>
          </p>
          <div className="success-actions">
            <button className="btn-secondary" onClick={() => onVoteSuccess()}>
              Retour aux élections
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    const candidat = candidats.find((c) => c.id === selectedCandidat);
    return (
      <div className="vote-page">
        <div className="vote-confirmation">
          <div className="confirmation-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2>Confirmer votre vote</h2>
          <p>Vous êtes sur le point de voter pour :</p>

          <div className="confirmation-candidate">
            <div className="candidate-avatar large">
              {getInitials(candidat.prenom, candidat.nom)}
            </div>
            <div className="candidate-info">
              <h3>
                {candidat.prenom} {candidat.nom}
              </h3>
              <span className="candidate-liste">{candidat.liste}</span>
            </div>
          </div>

          <div className="warning-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p>
              Cette action est <strong>irréversible</strong>. Vous ne pourrez
              pas modifier votre vote après confirmation.
            </p>
          </div>

          <div className="confirmation-actions">
            <button className="btn-cancel" onClick={() => setStep("selection")}>
              Annuler
            </button>
            <button
              className="btn-confirm"
              onClick={handleSubmitVote}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                <>Confirmer mon vote</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vote-page">
      {/* Header */}
      <div className="vote-header">
        <button className="btn-back" onClick={onBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Retour
        </button>
        <div className="vote-info">
          <h2>{election.titre}</h2>
          <p>Sélectionnez le candidat de votre choix</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="vote-instructions">
        <div className="instruction-item">
          <span className="instruction-number">1</span>
          <span>Consultez les programmes des candidats</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">2</span>
          <span>Sélectionnez votre candidat</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">3</span>
          <span>Confirmez votre vote</span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="candidates-grid">
        {candidats.map((candidat) => (
          <div
            key={candidat.id}
            className={`candidate-card ${selectedCandidat === candidat.id ? "selected" : ""}`}
            onClick={() => setSelectedCandidat(candidat.id)}
          >
            <div className="candidate-avatar">
              {candidat.photo ? (
                <img
                  src={candidat.photo}
                  alt={`${candidat.prenom} ${candidat.nom}`}
                />
              ) : (
                getInitials(candidat.prenom, candidat.nom)
              )}
            </div>
            <div className="candidate-details">
              <h3>
                {candidat.prenom} {candidat.nom}
              </h3>
              <span className="candidate-liste">{candidat.liste}</span>
              <p className="candidate-programme">{candidat.programme}</p>
            </div>
            <div className="selection-indicator">
              {selectedCandidat === candidat.id ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <div className="empty-circle"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="vote-footer">
        <p className="selected-info">
          {selectedCandidat ? (
            <>
              Candidat sélectionné :{" "}
              <strong>
                {candidats.find((c) => c.id === selectedCandidat)?.prenom}{" "}
                {candidats.find((c) => c.id === selectedCandidat)?.nom}
              </strong>
            </>
          ) : (
            "Aucun candidat sélectionné"
          )}
        </p>
        <button
          className="btn-validate"
          disabled={!selectedCandidat}
          onClick={() => setStep("confirmation")}
        >
          Valider mon choix
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ElecteurVote;
