import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./ElecteurResults.css";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const ElecteurResults = ({ election, onBack }) => {
  const [selectedElection, setSelectedElection] = useState(election?.id || 1);

  // Données simulées des élections terminées
  const electionsTerminees = [
    {
      id: 1,
      titre: "Élection du Conseil d'Administration",
      dateFin: "2025-12-15",
      totalVotants: 1245,
      totalInscrits: 1500,
      candidats: [
        {
          id: 1,
          nom: "Martin Sophie",
          liste: "Ensemble pour l'Université",
          votes: 485,
          pourcentage: 39,
        },
        {
          id: 2,
          nom: "Dubois Pierre",
          liste: "Avenir Étudiant",
          votes: 372,
          pourcentage: 30,
        },
        {
          id: 3,
          nom: "Bernard Marie",
          liste: "Innovation Campus",
          votes: 248,
          pourcentage: 20,
        },
        {
          id: 4,
          nom: "Petit Lucas",
          liste: "Campus Vert",
          votes: 140,
          pourcentage: 11,
        },
      ],
    },
    {
      id: 2,
      titre: "Délégués Master 1",
      dateFin: "2025-11-30",
      totalVotants: 89,
      totalInscrits: 120,
      candidats: [
        {
          id: 1,
          nom: "Leroy Thomas",
          liste: "M1 Unis",
          votes: 45,
          pourcentage: 51,
        },
        {
          id: 2,
          nom: "Moreau Julie",
          liste: "Ensemble M1",
          votes: 32,
          pourcentage: 36,
        },
        {
          id: 3,
          nom: "Simon Paul",
          liste: "Avenir M1",
          votes: 12,
          pourcentage: 13,
        },
      ],
    },
  ];

  const currentElection =
    electionsTerminees.find((e) => e.id === selectedElection) ||
    electionsTerminees[0];
  const tauxParticipation = Math.round(
    (currentElection.totalVotants / currentElection.totalInscrits) * 100,
  );

  // Couleurs pour les graphiques
  const chartColors = [
    "rgba(30, 58, 95, 0.8)",
    "rgba(245, 158, 11, 0.8)",
    "rgba(34, 197, 94, 0.8)",
    "rgba(99, 102, 241, 0.8)",
    "rgba(236, 72, 153, 0.8)",
  ];

  const chartBorderColors = [
    "rgb(30, 58, 95)",
    "rgb(245, 158, 11)",
    "rgb(34, 197, 94)",
    "rgb(99, 102, 241)",
    "rgb(236, 72, 153)",
  ];

  // Données pour le graphique en barres
  const barData = {
    labels: currentElection.candidats.map((c) => c.nom.split(" ")[0]),
    datasets: [
      {
        label: "Nombre de votes",
        data: currentElection.candidats.map((c) => c.votes),
        backgroundColor: chartColors.slice(0, currentElection.candidats.length),
        borderColor: chartBorderColors.slice(
          0,
          currentElection.candidats.length,
        ),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 58, 95, 0.9)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: { size: 12 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  // Données pour le camembert
  const pieData = {
    labels: currentElection.candidats.map((c) => c.nom),
    datasets: [
      {
        data: currentElection.candidats.map((c) => c.votes),
        backgroundColor: chartColors.slice(0, currentElection.candidats.length),
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 58, 95, 0.9)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return ` ${value} votes (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        {onBack && (
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
        )}
        <div className="results-title">
          <h2>Résultats des élections</h2>
          <p>Consultez les résultats détaillés des élections terminées</p>
        </div>
      </div>

      {/* Election Selector */}
      <div className="election-selector">
        <label>Sélectionner une élection :</label>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(Number(e.target.value))}
        >
          {electionsTerminees.map((el) => (
            <option key={el.id} value={el.id}>
              {el.titre}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="results-stats">
        <div className="results-stat-card">
          <div className="stat-icon blue">
            <svg
              width="24"
              height="24"
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
          </div>
          <div className="stat-content">
            <span className="stat-value">{currentElection.totalInscrits}</span>
            <span className="stat-label">Inscrits</span>
          </div>
        </div>

        <div className="results-stat-card">
          <div className="stat-icon green">
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
          <div className="stat-content">
            <span className="stat-value">{currentElection.totalVotants}</span>
            <span className="stat-label">Votants</span>
          </div>
        </div>

        <div className="results-stat-card">
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
          <div className="stat-content">
            <span className="stat-value">{tauxParticipation}%</span>
            <span className="stat-label">Participation</span>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      <div className="winner-banner">
        <div className="winner-badge">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <div className="winner-info">
          <span className="winner-label">Vainqueur</span>
          <h3>{currentElection.candidats[0].nom}</h3>
          <p>
            {currentElection.candidats[0].liste} •{" "}
            {currentElection.candidats[0].votes} votes (
            {currentElection.candidats[0].pourcentage}%)
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Répartition des votes</h3>
          <div className="chart-container bar">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Pourcentages</h3>
          <div className="chart-container pie">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="results-table-container">
        <h3>Résultats détaillés</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Candidat</th>
              <th>Liste</th>
              <th>Votes</th>
              <th>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            {currentElection.candidats.map((candidat, index) => (
              <tr key={candidat.id} className={index === 0 ? "winner-row" : ""}>
                <td>
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                </td>
                <td className="candidate-name">
                  {candidat.nom}
                  {index === 0 && <span className="winner-tag">Élu</span>}
                </td>
                <td>{candidat.liste}</td>
                <td className="votes-cell">{candidat.votes}</td>
                <td>
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{
                        width: `${candidat.pourcentage}%`,
                        backgroundColor: chartColors[index],
                      }}
                    ></div>
                    <span>{candidat.pourcentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElecteurResults;
