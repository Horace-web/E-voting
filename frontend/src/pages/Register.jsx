import React, { useState } from "react";
import "./Register.css";

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "electeur",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription à implémenter plus tard
    console.log("Form submitted:", formData);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Section - Form */}
        <div className="register-form-section">
          <div className="register-header">
            <div className="logo">
              <span className="logo-icon">🗳️</span>
              <span className="logo-text">E-VOTING</span>
            </div>
          </div>

          <div className="register-content">
            <h1 className="register-title">Créer un compte</h1>
            <p className="register-subtitle">
              Inscrivez-vous pour accéder à la plateforme de vote
            </p>

            <form onSubmit={handleSubmit} className="register-form">
              {/* First Name and Last Name */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    Prénom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  Email institutionnel <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jean.dupont@universite.fr"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">
                  Mot de passe <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="8 caractères minimum"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Répétez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Account Type */}
              <div className="form-group">
                <label>Type de compte</label>
                <div className="account-type-options">
                  <div
                    className={`account-type-card ${
                      formData.accountType === "electeur" ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, accountType: "electeur" })
                    }
                  >
                    <div className="account-icon">👤</div>
                    <div className="account-info">
                      <h3>Électeur</h3>
                      <p>Peut voter dans les élections</p>
                    </div>
                  </div>
                  <div
                    className={`account-type-card ${
                      formData.accountType === "administrateur" ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accountType: "administrateur",
                      })
                    }
                  >
                    <div className="account-icon">⚙️</div>
                    <div className="account-info">
                      <h3>Administrateur</h3>
                      <p>Sur invitation uniquement</p>
                    </div>
                  </div>
                </div>
                {formData.accountType === "administrateur" && (
                  <div className="admin-note">
                    <span className="info-icon">ℹ️</span>
                    Le rôle d'administrateur est attribué uniquement par le
                    Super-Admin.
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acceptTerms">
                  J'accepte les{" "}
                  <span className="link">conditions d'utilisation</span> et la{" "}
                  <span className="link">politique de confidentialité</span> de
                  la plateforme E-VOTING
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-submit">
                <span className="btn-icon">👤</span>
                Créer mon compte
              </button>
            </form>

            {/* Footer Links */}
            <div className="form-footer">
              <p>Déjà un compte ?</p>
              <div className="footer-links">
                <button
                  onClick={() => onNavigate("login")}
                  className="footer-link"
                >
                  🔑 Se connecter
                </button>
                <span className="separator">•</span>
                <button
                  onClick={() => onNavigate("landing")}
                  className="footer-link"
                >
                  🏠 Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Info */}
        <div className="register-info-section">
          <div className="info-content">
            <h2 className="info-title">Pourquoi s'inscrire ?</h2>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon-circle">🔒</div>
                <div className="info-text">
                  <h3>Sécurité garantie</h3>
                  <p>Authentification forte et données chiffrées</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">🗳️</div>
                <div className="info-text">
                  <h3>Vote simplifié</h3>
                  <p>Participation aux élections en quelques clics</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">⏱️</div>
                <div className="info-text">
                  <h3>Gain de temps</h3>
                  <p>Plus besoin de se déplacer pour voter</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-circle">📊</div>
                <div className="info-text">
                  <h3>Transparence</h3>
                  <p>Résultats en temps réel et traçabilité</p>
                </div>
              </div>
            </div>

            <div className="info-notice">
              <h4>Information importante</h4>
              <ul>
                <li>
                  Seules les adresses email institutionnelles sont acceptées
                </li>
                <li>
                  Les comptes électeurs sont automatiquement créés pour les
                  élections
                </li>
                <li>Les administrateurs sont nommés par le Super-Admin</li>
                <li>Tous les votes sont anonymes et sécurisés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
