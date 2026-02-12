import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../auth/AuthContext";
import authService from "../services/auth.service";
import config from "../config/app.config";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    }
    // Note: La validation de complexité du mot de passe se fait côté backend selon le guide

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let userData;
      let role;

      if (config.useMockData) {
        // Simulation connexion
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] Connexion:", email);

        // Simuler donnÃ©es utilisateur
        userData = {
          id: 1,
          firstName: "Jean",
          lastName: "Dupont",
          email: email,
        };

        // Simuler : si email contient "admin", c'est un admin, sinon Ã©lecteur
        role = email.includes("admin") ? "admin" : "voter";
      } else {
        // Appel API réel
        const response = await authService.login(email, password);
        console.log("========================================");
        console.log("RÉPONSE BACKEND:", response);
        console.log("User:", response.user);
        console.log("Role reçu:", response.user.role);
        console.log("========================================");
        userData = response.user;

        // Normaliser le rôle selon le guide Postman (ADMIN, VOTER, AUDITOR)
        let roleRaw = response.user.role || "voter";
        role = roleRaw.toUpperCase(); // Garder en majuscules comme dans le guide

        console.log("Role final (normalisé):", role);
      }

      login(userData, role);

      // Récupérer la destination de redirection (si définie depuis la landing page)
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirection selon le guide Postman
      console.log("REDIRECTION - Role:", role);
      if (role === "ADMIN") {
        console.log("→ /admin/dashboard");
        navigate("/admin/dashboard");
      } else if (role === "VOTER") {
        console.log("→ /elections");
        navigate("/elections");
      } else if (role === "AUDITOR") {
        console.log("→ /audit");
        navigate("/audit");
      } else {
        console.log("→ /login (défaut)");
        navigate("/login");
      }
    } catch (error) {
      console.error("Erreur connexion:", error);

      // Gestion des erreurs selon le guide Postman
      if (error.response?.status === 401) {
        setErrors({
          general: "Identifiants incorrects",
        });
      } else if (error.response?.status === 403) {
        setErrors({
          general: "Compte non activé ou désactivé",
        });
      } else if (error.response?.status === 429) {
        setErrors({
          general: "Trop de tentatives. Veuillez attendre 15 minutes avant de réessayer.",
        });
      } else if (error.response?.status === 422) {
        // Afficher les erreurs de validation par champ
        const data = error.response.data;
        const fieldErrors = {};
        
        if (data.errors) {
          Object.keys(data.errors).forEach(field => {
            fieldErrors[field] = data.errors[field][0]; // Première erreur par champ
          });
        }
        
        setErrors({
          general: data.message || "Erreur de validation",
          ...fieldErrors,
        });
      } else {
        setErrors({
          general: error.response?.data?.message || "Erreur lors de la connexion",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header showNav={true} />

      {/* Main Content */}
      <div className="flex-1 py-8 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Section - Info */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              AccÃ©dez Ã  vos scrutins
            </h1>
            <p className="text-xl text-gray-600">
              Connectez-vous en toute sÃ©curitÃ© avec votre email et mot de passe reÃ§us par email.
            </p>

            <div className="space-y-4 pt-4">
              {/* Authentification sÃ©curisÃ©e */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-blue-600" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Authentification sÃ©curisÃ©e
                  </h3>
                  <p className="text-gray-600">Mot de passe hachÃ© avec bcrypt (cost=10)</p>
                </div>
              </div>

              {/* DonnÃ©es protÃ©gÃ©es */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="text-green-600" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">DonnÃ©es protÃ©gÃ©es</h3>
                  <p className="text-gray-600">Chiffrement de bout en bout pour vos informations</p>
                </div>
              </div>

              {/* Confirmation par email */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-amber-600" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Confirmation par email
                  </h3>
                  <p className="text-gray-600">
                    Activation du compte aprÃ¨s confirmation (lien valide 48h)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-2xl flex items-center justify-center">
                <Mail className="text-white" size={32} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Connexion</h2>
            <p className="text-center text-gray-600 mb-8">
              Entrez vos identifiants reÃ§us par email
            </p>

            {/* Error Alert */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: "", general: "" });
                    }}
                    placeholder="votant@universite.bj"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: "", general: "" });
                    }}
                    placeholder="Entrez votre mot de passe"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                    ) : (
                      <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#1e3a5f] hover:text-[#16304d] font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold hover:from-[#0f2744] hover:to-[#1e3a5f] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas encore confirmÃ© votre inscription ?
              </p>
              <p className="text-sm text-gray-600 mt-1">VÃ©rifiez vos emails (lien valide 48h)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
