import React, { useState } from "react";
import "./Login.css";

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion à implémenter plus tard
    console.log("Login submitted:", email);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section - Form */}
        <div className="login-form-section">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🗳️</span>
              <span className="logo-text">E-VOTING</span>
            </div>
          </div>

          <div className="login-content">
            <h1 className="login-title">Connectez-vous</h1>
            <p className="login-subtitle">
              Saisissez votre email institutionnel pour continuer
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email institutionnel</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="prenom.nom@universite.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-continue">
                Continuer
              </button>
            </form>

            <div className="admin-only">
              <p>Administrateurs uniquement</p>
            </div>

            <div className="social-login">
              <button className="btn-google">
                <span className="google-icon">G</span>
                Continuer avec Google
              </button>
              <button className="btn-microsoft">
                <span className="microsoft-icon">⊞</span>
                Continuer avec Microsoft 365
              </button>
            </div>

            <div className="form-footer">
              <div className="footer-links">
                <button
                  onClick={() => onNavigate("landing")}
                  className="footer-link"
                >
                  ← Retour à l'accueil
                </button>
                <span className="separator">•</span>
                <button
                  onClick={() => onNavigate("landing")}
                  className="footer-link"
                >
                  Première connexion ? Aide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Info */}
        <div className="login-info-section">
          <div className="info-content">
            <h2 className="info-title">Bienvenue sur E-VOTING</h2>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon-circle">🔒</div>
                <div className="info-text">
                  <h3>Système de vote sécurisé</h3>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">�</div>
                <div className="info-text">
                  <h3>Rôle détecté automatiquement</h3>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">📧</div>
                <div className="info-text">
                  <h3>Code OTP pour les électeurs</h3>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">🔐</div>
                <div className="info-text">
                  <h3>Authentification admin renforcée</h3>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">📊</div>
                <div className="info-text">
                  <h3>Résultats en temps réel</h3>
                </div>
              </div>
            </div>

            <div className="info-notice">
              <h4>Comment ça marche ?</h4>
              <ul>
                <li>
                  • <strong>Électeurs</strong> : Saisissez votre email → recevez
                  un code OTP → votez
                </li>
                <li>
                  • <strong>Administrateurs</strong> : Mot de passe ou compte
                  professionnel
                </li>
                <li>
                  • <strong>Rôle par défaut</strong> : Électeur
                </li>
                <li>
                  • <strong>Attribution rôles admin</strong> : Super-Admin
                  uniquement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
