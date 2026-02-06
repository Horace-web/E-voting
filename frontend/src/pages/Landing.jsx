import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Vote,
  Shield,
  UserRound,
  Clock4,
  BarChart3,
  ChevronRight,
  UserPlus,
  FileCheck,
  Send,
  Mail,
} from "lucide-react";
import LogoIcon from "../components/LogoIcon";
import { useAuth } from "../auth/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [activeLink, setActiveLink] = useState("top");

  // Navigation vers les sections de la landing page (scroll)
  const handleSectionClick = (e, section) => {
    e.preventDefault();
    setActiveLink(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigation vers les pages protégées (redirige vers login si non connecté)
  const handleProtectedNavigation = (e, targetPath) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      // Stocker la destination pour redirection après connexion
      sessionStorage.setItem("redirectAfterLogin", targetPath);
      navigate("/login");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-16 py-4 max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center justify-center w-10 h-10 bg-[#1e3a5f] rounded-lg text-white">
              <LogoIcon size={26} />
            </span>
            <span className="text-2xl font-bold text-[#1e3a5f]">E-Vote</span>
          </button>
          <nav className="hidden md:flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeLink === "top"
                  ? "bg-[#1e3a5f] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#1e3a5f]"
              }`}
              onClick={(e) => handleProtectedNavigation(e, "/electeur")}
            >
              Accueil
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeLink === "elections"
                  ? "bg-[#1e3a5f] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#1e3a5f]"
              }`}
              onClick={(e) => handleProtectedNavigation(e, "/electeur/vote")}
            >
              Scrutins
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeLink === "results"
                  ? "bg-[#1e3a5f] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#1e3a5f]"
              }`}
              onClick={(e) => handleProtectedNavigation(e, "/electeur/resultats")}
            >
              Résultats
            </button>
          </nav>
          <div>
            {isAuthenticated ? (
              <button
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all"
                onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}
              >
                Mon espace
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-6">
            <Vote size={18} />
            <span className="text-sm font-medium">Plateforme de Vote Électronique Sécurisée</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Votez en toute <span className="text-amber-500">confiance</span>,
            <br />
            en toute <span className="text-amber-500">simplicité</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Une plateforme moderne et sécurisée pour les élections internes de votre établissement.
            Vote anonyme, résultats transparents.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={(e) => handleProtectedNavigation(e, "/electeur/vote")}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#16304d] transition-all shadow-lg hover:shadow-xl"
            >
              Voir les scrutins <ChevronRight size={20} />
            </button>
            {isAuthenticated ? (
              <button
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
                onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}
              >
                Mon espace
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-12 bg-gradient-to-br from-[#1e3a5f] to-[#16304d]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-sm md:text-base text-blue-100">Votants inscrits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-sm md:text-base text-blue-100">Scrutins réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-sm md:text-base text-blue-100">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm md:text-base text-blue-100">Anonymat garanti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Pourquoi choisir E-Vote ?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Une solution complète qui répond à toutes les exigences de sécurité et de transparence
            pour vos élections internes.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <article className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurisé</h3>
              <p className="text-gray-600">
                Authentification forte par OTP et chiffrement des données pour garantir l'intégrité
                du vote.
              </p>
            </article>
            <article className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <UserRound className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Anonyme</h3>
              <p className="text-gray-600">
                Séparation complète entre l'identité du votant et son choix de vote.
              </p>
            </article>
            <article className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Clock4 className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapide</h3>
              <p className="text-gray-600">
                Votez en quelques clics depuis n'importe quel appareil connecté.
              </p>
            </article>
            <article className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-amber-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent</h3>
              <p className="text-gray-600">
                Résultats en temps réel et export des données pour audit.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="process"
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-[#1e3a5f] to-[#16304d] text-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 text-center mb-12">
            Un processus simple et sécurisé en 3 étapes
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="relative p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100">
              <div className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full mb-4">
                Étape 01
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre compte avec votre adresse email institutionnelle. Votre identité sera
                vérifiée automatiquement.
              </p>
            </article>
            <article className="relative p-6 md:p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100">
              <div className="inline-block px-4 py-1 bg-purple-600 text-white text-sm font-bold rounded-full mb-4">
                Étape 02
              </div>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <FileCheck className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Consultez les scrutins</h3>
              <p className="text-gray-600">
                Accédez aux élections en cours et découvrez les candidats et leurs programmes.
              </p>
            </article>
            <article className="relative p-6 md:p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-100">
              <div className="inline-block px-4 py-1 bg-amber-600 text-white text-sm font-bold rounded-full mb-4">
                Étape 03
              </div>
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <Send className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Votez en toute confiance</h3>
              <p className="text-gray-600">
                Exprimez votre choix de manière anonyme et sécurisée. Votre vote est chiffré et
                inviolable.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Prêt à participer ?</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec votre adresse email institutionnelle pour accéder aux scrutins qui
            vous concernent et exercer votre droit de vote.
          </p>
          {isAuthenticated ? (
            <button
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#16304d] transition-all shadow-lg hover:shadow-xl"
              onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}
            >
              Mon espace <ChevronRight size={20} />
            </button>
          ) : (
            <button
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#16304d] transition-all shadow-lg hover:shadow-xl"
              onClick={() => navigate("/login")}
            >
              Se connecter maintenant <ChevronRight size={20} />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#1e3a5f] to-[#16304d] text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-[#1e3a5f] rounded-lg text-white">
                  <LogoIcon size={26} />
                </span>
                <span className="text-xl font-bold text-white">E-Vote</span>
              </div>
              <p className="text-gray-400 mb-4">
                Plateforme de vote électronique sécurisée pour les élections internes universitaires
                et associatives.
              </p>
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-2 text-sm">
                  <Shield size={16} className="text-blue-400" /> Sécurisé
                </span>
                <span className="inline-flex items-center gap-2 text-sm">
                  <UserRound size={16} className="text-green-400" /> Anonyme
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#elections" className="hover:text-white transition-colors">
                    Scrutins en cours
                  </a>
                </li>
                <li>
                  <a href="#results" className="hover:text-white transition-colors">
                    Résultats
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <p className="flex items-center gap-2 mb-2">
                <Mail size={16} /> support@evote.edu
              </p>
              <p className="text-gray-400">
                En cas de problème technique, contactez l'administrateur.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p className="mb-1">© 2026 E-Vote. Tous droits réservés.</p>
            <p>Projet tuteuré - Système de Vote Électronique Sécurisé</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
