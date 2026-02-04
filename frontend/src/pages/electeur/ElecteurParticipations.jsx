import React from "react";
import "./ElecteurParticipations.css";

const ElecteurParticipations = () => {
  // Données simulées des participations
  const participations = [
    {
      id: 1,
      titre: "Élection du Conseil d'Administration",
      date: "2026-01-15",
      heure: "14:32",
      refTransaction: "TXN7A8B9C0D1",
      status: "confirmé",
    },
    {
      id: 2,
      titre: "Délégués Master 1",
      date: "2025-12-20",
      heure: "10:15",
      refTransaction: "TXN2E3F4G5H6",
      status: "confirmé",
    },
    {
      id: 3,
      titre: "Bureau des Sports 2025",
      date: "2025-10-05",
      heure: "16:48",
      refTransaction: "TXN8I9J0K1L2",
      status: "confirmé",
    },
    {
      id: 4,
      titre: "Représentants L2 Informatique",
      date: "2025-09-12",
      heure: "09:22",
      refTransaction: "TXN3M4N5O6P7",
      status: "confirmé",
    },
    {
      id: 5,
      titre: "Élection du BDE 2025",
      date: "2025-02-28",
      heure: "11:05",
      refTransaction: "TXN9Q0R1S2T3",
      status: "confirmé",
    },
  ];

  return (
    <div className="participations-page">
      <div className="participations-header">
        <h2>Mes participations</h2>
        <p>Historique de vos votes (anonymes et sécurisés)</p>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          Pour garantir l'anonymat de votre vote, seule la participation est
          enregistrée. Le contenu de votre vote reste strictement confidentiel.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="participations-stats">
        <div className="stat-item">
          <span className="stat-number">{participations.length}</span>
          <span className="stat-text">Participations totales</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-text">Votes confirmés</span>
        </div>
      </div>

      {/* Participations Table */}
      <div className="participations-table-container">
        <table className="participations-table">
          <thead>
            <tr>
              <th>Élection</th>
              <th>Date & Heure</th>
              <th>Référence</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {participations.map((participation) => (
              <tr key={participation.id}>
                <td>
                  <div className="election-cell">
                    <div className="election-icon">
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
                    </div>
                    <span>{participation.titre}</span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <span className="date">
                      {new Date(participation.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="time">{participation.heure}</span>
                  </div>
                </td>
                <td>
                  <code className="ref-code">
                    {participation.refTransaction}
                  </code>
                </td>
                <td>
                  <span className="status-badge confirmed">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Confirmé
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (hidden on desktop) */}
      <div className="participations-cards">
        {participations.map((participation) => (
          <div key={participation.id} className="participation-card">
            <div className="card-row">
              <span className="card-label">Élection</span>
              <span className="card-value">{participation.titre}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Date</span>
              <span className="card-value">
                {new Date(participation.date).toLocaleDateString("fr-FR")} à{" "}
                {participation.heure}
              </span>
            </div>
            <div className="card-row">
              <span className="card-label">Référence</span>
              <code className="ref-code">{participation.refTransaction}</code>
            </div>
            <div className="card-row">
              <span className="card-label">Statut</span>
              <span className="status-badge confirmed">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirmé
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElecteurParticipations;
