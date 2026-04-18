import React from "react";
import "./ElecteurDashboard.css";

const ElecteurDashboard = ({ user, onViewElections }) => {
  // Données simulées
  const stats = {
    electionsActives: 3,
    participations: 12,
    tauxParticipation: 85,
  };

  const electionsEnCours = [
    {
      id: 1,
      titre: "Élection du Bureau des Étudiants",
      dateFin: "2026-02-15",
      candidats: 5,
      status: "active",
    },
    {
      id: 2,
      titre: "Représentants L3 Informatique",
      dateFin: "2026-02-10",
      candidats: 3,
      status: "active",
    },
  ];

  const dernieresParticipations = [
    {
      id: 1,
      titre: "Élection du Conseil d'Administration",
      date: "2026-01-15",
      status: "terminée",
    },
    {
      id: 2,
      titre: "Délégués Master 1",
      date: "2025-12-20",
      status: "terminée",
    },
  ];

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Bienvenue, {user.firstName} ! </h2>
          <p>
            Vous avez <strong>{stats.electionsActives} élections</strong> en
            cours auxquelles vous pouvez participer.
          </p>
          <button className="btn-primary" onClick={onViewElections}>
            Voir les élections
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
        <div className="welcome-illustration">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m9 12 2 2 4-4" />
            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
            <path d="M22 19H2" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 12 2 2 4-4" />
              <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
              <path d="M22 19H2" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.electionsActives}</span>
            <span className="stat-label">Élections actives</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
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
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.participations}</span>
            <span className="stat-label">Participations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.tauxParticipation}%</span>
            <span className="stat-label">Taux de participation</span>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="dashboard-grid">
        {/* Elections en cours */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Élections en cours</h3>
            <button className="link-btn" onClick={onViewElections}>
              Voir tout
            </button>
          </div>
          <div className="card-content">
            {electionsEnCours.map((election) => (
              <div key={election.id} className="election-item">
                <div className="election-info">
                  <h4>{election.titre}</h4>
                  <p>
                    <span className="badge badge-blue">
                      {election.candidats} candidats
                    </span>
                    <span className="date">
                      Fin :{" "}
                      {new Date(election.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                </div>
                <button className="btn-vote" onClick={onViewElections}>
                  Voter
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières participations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Dernières participations</h3>
          </div>
          <div className="card-content">
            {dernieresParticipations.map((participation) => (
              <div key={participation.id} className="participation-item">
                <div className="participation-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="participation-info">
                  <h4>{participation.titre}</h4>
                  <p>
                    {new Date(participation.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="badge badge-green">Voté</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElecteurDashboard;
