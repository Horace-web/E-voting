import React, { useState } from "react";
import "./ElecteurElections.css";

const ElecteurElections = ({ onSelectElection }) => {
  const [filter, setFilter] = useState("toutes");
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const elections = [
    {
      id: 1,
      titre: "Élection du Bureau des Étudiants",
      description:
        "Élection annuelle pour désigner les membres du BDE de l'université pour l'année 2026-2027.",
      dateDebut: "2026-02-01",
      dateFin: "2026-02-15",
      candidats: 5,
      status: "active",
      aVote: false,
    },
    {
      id: 2,
      titre: "Représentants L3 Informatique",
      description:
        "Élection des délégués de la promotion L3 Informatique pour le second semestre.",
      dateDebut: "2026-02-05",
      dateFin: "2026-02-10",
      candidats: 3,
      status: "active",
      aVote: false,
    },
    {
      id: 3,
      titre: "Élection du Conseil d'Administration",
      description:
        "Élection des représentants étudiants au conseil d'administration de l'université.",
      dateDebut: "2025-12-01",
      dateFin: "2025-12-15",
      candidats: 8,
      status: "terminée",
      aVote: true,
    },
    {
      id: 4,
      titre: "Délégués Master 1",
      description:
        "Élection des délégués pour les différentes spécialités du Master 1.",
      dateDebut: "2025-11-15",
      dateFin: "2025-11-30",
      candidats: 6,
      status: "terminée",
      aVote: true,
    },
    {
      id: 5,
      titre: "Bureau des Sports",
      description:
        "Élection du nouveau bureau de l'association sportive universitaire.",
      dateDebut: "2026-03-01",
      dateFin: "2026-03-15",
      candidats: 4,
      status: "à venir",
      aVote: false,
    },
  ];

  const filteredElections = elections.filter((election) => {
    const matchFilter = filter === "toutes" || election.status === filter;
    const matchSearch = election.titre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusBadge = (status, aVote) => {
    if (aVote) {
      return <span className="badge badge-voted">✓ Voté</span>;
    }
    switch (status) {
      case "active":
        return <span className="badge badge-active">En cours</span>;
      case "terminée":
        return <span className="badge badge-ended">Terminée</span>;
      case "à venir":
        return <span className="badge badge-upcoming">À venir</span>;
      default:
        return null;
    }
  };

  const getActionButton = (election) => {
    if (election.aVote) {
      return (
        <button
          className="btn-results"
          onClick={() => onSelectElection(election, "results")}
        >
          Voir les résultats
        </button>
      );
    }
    if (election.status === "active") {
      return (
        <button
          className="btn-vote-main"
          onClick={() => onSelectElection(election, "vote")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 12 2 2 4-4" />
            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
            <path d="M22 19H2" />
          </svg>
          Voter maintenant
        </button>
      );
    }
    if (election.status === "terminée") {
      return (
        <button
          className="btn-results"
          onClick={() => onSelectElection(election, "results")}
        >
          Voir les résultats
        </button>
      );
    }
    return <span className="coming-soon">Ouverture prochaine</span>;
  };

  return (
    <div className="elections-page">
      <div className="elections-header">
        <h2>Élections disponibles</h2>
        <p>Consultez les élections en cours et participez au vote</p>
      </div>

      {/* Filters */}
      <div className="elections-filters">
        <div className="search-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une élection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "toutes" ? "active" : ""}`}
            onClick={() => setFilter("toutes")}
          >
            Toutes
          </button>
          <button
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            En cours
          </button>
          <button
            className={`filter-tab ${filter === "terminée" ? "active" : ""}`}
            onClick={() => setFilter("terminée")}
          >
            Terminées
          </button>
          <button
            className={`filter-tab ${filter === "à venir" ? "active" : ""}`}
            onClick={() => setFilter("à venir")}
          >
            À venir
          </button>
        </div>
      </div>

      {/* Elections List */}
      <div className="elections-list">
        {filteredElections.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3>Aucune élection trouvée</h3>
            <p>Modifiez vos critères de recherche</p>
          </div>
        ) : (
          filteredElections.map((election) => (
            <div
              key={election.id}
              className={`election-card ${election.status}`}
            >
              <div className="election-card-header">
                <div className="election-title-row">
                  <h3>{election.titre}</h3>
                  {getStatusBadge(election.status, election.aVote)}
                </div>
                <p className="election-description">{election.description}</p>
              </div>
              <div className="election-card-body">
                <div className="election-meta">
                  <div className="meta-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      Du{" "}
                      {new Date(election.dateDebut).toLocaleDateString("fr-FR")}{" "}
                      au{" "}
                      {new Date(election.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="meta-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>
                      {election.candidats} candidat
                      {election.candidats > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="election-card-footer">
                {getActionButton(election)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ElecteurElections;
