import React from "react";
import "./Landing.css";
import Lock1 from "../assets/Lock1.svg";
import Flash from "../assets/flash.svg";
import Graph from "../assets/graph.svg";

const Landing = ({ onNavigate }) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">🗳️</span>
          <span className="logo-text">E-VOTING</span>
        </div>
        <div className="header-actions">
          <button onClick={() => onNavigate("login")} className="btn-connexion">
            Connexion
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="btn-inscrire"
          >
            S'inscrire
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Vote Électronique Sécurisé</h1>
          <h2 className="hero-subtitle">pour Élections Internes</h2>
          <p className="hero-description">
            Modernisez vos processus électoraux avec une plateforme fiable,
            transparente et conforme aux exigences de sécurité. Conçu pour les
            universités, associations et organisations.
          </p>
          <div className="hero-buttons">
            <button onClick={() => onNavigate("register")} className="btn-demo">
              Découvrir une démo gratuite
            </button>
            <button
              onClick={() => onNavigate("landing")}
              className="btn-features"
            >
              Voir les fonctionnalités
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <h2 className="section-title">Pourquoi choisir E-VOTING ?</h2>
        <p className="section-subtitle">
          Une solution complète répondant aux exigences des élections internes
          modernes
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <img src={Lock1} alt="Sécurité" />
            </div>
            <h3 className="feature-title">Sécurité Maximale</h3>
            <p className="feature-description">
              Authentification forte par OTP, vote unique garanti, anonymisation
              des bulletins et chiffrement des données.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={Flash} alt="Rapidité" />
            </div>
            <h3 className="feature-title">Rapidité & Efficacité</h3>
            <p className="feature-description">
              Résultats en temps réel, élimination des déplacements manuels,
              réduction du temps de traitement de plus de 80%.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={Graph} alt="Transparence" />
            </div>
            <h3 className="feature-title">Transparence Totale</h3>
            <p className="feature-description">
              Journal d'audit complet, export des données en PDF/CSV,
              traçabilité de toutes les actions administrateur.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2 className="section-title">Processus simplifié en 4 étapes</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Configuration</h3>
            <p className="step-description">
              Créez l'élection, définissez les dates et importez la liste des
              électeurs.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Invitation</h3>
            <p className="step-description">
              Envoi automatique des liens sécurisés et codes OTP aux électeurs.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Vote</h3>
            <p className="step-description">
              Interface intuitive, validation en un clic avec confirmation
              immédiate.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3 className="step-title">Résultats</h3>
            <p className="step-description">
              Dépouillement automatique, dashboard interactif et exports.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Tableau de bord administrateur</h2>
        <div className="dashboard-content">
          <div className="dashboard-preview">
            <div className="chart-placeholder">
              <div className="chart-bar" style={{ height: "60%" }}></div>
              <div className="chart-bar" style={{ height: "100%" }}></div>
              <div className="chart-bar" style={{ height: "70%" }}></div>
              <div className="chart-bar" style={{ height: "85%" }}></div>
            </div>
            <p className="chart-caption">
              Visualisation en temps réel des résultats avec graphiques
              interactifs et données exportables en PDF/CSV
            </p>
          </div>
          <div className="dashboard-description">
            <h3>
              «E-VOTING a révolutionné nos élections étudiantes. La plateforme
              est intuitive, sécurisée et nous fait gagner un temps
              considérable. Les résultats sont disponibles instantanément à la
              clôture du vote.»
            </h3>
            <p className="dashboard-author">
              — Responsable des élections, Université Paris
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>E-VOTING</h3>
            <p>
              Plateforme de vote électronique sécurisée pour élections internes
            </p>
          </div>
          <div className="footer-links">
            <p>
              Projet Tutoré • Équipe • CODUMAU Étudia Auberge • DOUMOU Jacky •
              69006€ Bryan
            </p>
          </div>
          <div className="footer-copyright">
            <p>© 2025 E-VOTING • Système de Vote Électronique Sécurisé</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
