import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import config from "../config/app.config";

const ConfirmAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de confirmation manquant");
    }
  }, [token]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins 1 lettre majuscule");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins 1 lettre minuscule");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins 1 chiffre");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins 1 caractère spécial (@$!%*?&)");
    }
    
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("Token de confirmation manquant");
      return;
    }

    // Validation mot de passe selon le guide Postman
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setStatus("error");
      setMessage(passwordErrors[0]); // Afficher la première erreur
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      if (config.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStatus("success");
        setMessage("Votre compte a été activé avec succès !");
      } else {
        const response = await authService.confirmAccount(
          token,
          password,
          confirmPassword
        );
        setStatus("success");
        setMessage(response.message || "Votre compte a été activé avec succès !");
        
        // Sauvegarder le token et rediriger selon le guide Postman
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("role", response.user.role || "voter");
          
          // Redirection selon le rôle
          setTimeout(() => {
            if (response.user.role === "ADMIN") {
              navigate("/admin/dashboard");
            } else if (response.user.role === "VOTER") {
              navigate("/elections");
            } else if (response.user.role === "AUDITOR") {
              navigate("/audit");
            } else {
              navigate("/login");
            }
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Erreur confirmation:", error);
      setStatus("error");
      
      // Gestion des erreurs selon le guide Postman
      if (error.response?.status === 401) {
        setMessage("Token invalide ou expiré");
      } else if (error.response?.status === 422) {
        // Afficher les erreurs de validation par champ
        const data = error.response.data;
        if (data.errors && data.errors.password) {
          setMessage(data.errors.password[0]); // Première erreur de mot de passe
        } else {
          setMessage(data.message || "Erreur de validation");
        }
      } else {
        setMessage(error.response?.data?.message || "Erreur lors de la confirmation");
      }
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header showNav={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {status === "loading" && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 mx-auto">
                  <Loader2 className="text-blue-600 animate-spin" size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Activation en cours...
                </h2>
                <p className="text-gray-600">Veuillez patienter pendant la validation du compte</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 mx-auto animate-bounce">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Compte activé !
                </h2>
                <p className="text-lg text-gray-600 mb-8">{message}</p>

                {/* Login Button */}
                <button
                  onClick={handleGoToLogin}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <span>Accéder à la connexion</span>
                  <ArrowRight size={20} />
                </button>

                <p className="mt-6 text-sm text-gray-500">
                  Vous serez redirigé vers la page de connexion où vous pourrez utiliser vos identifiants
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 mx-auto">
                  <XCircle className="text-red-600" size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Échec de la confirmation
                </h2>
                <p className="text-lg text-gray-600 mb-8">{message}</p>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left">
                  <h3 className="font-semibold text-red-900 mb-3">Raisons possibles :</h3>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Le lien de confirmation a expiré (validité : 48 heures)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Le lien a déjà été utilisé pour activer votre compte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Le lien est invalide ou corrompu</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleGoToLogin}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <span>Essayer de se connecter</span>
                    <ArrowRight size={20} />
                  </button>

                  <p className="text-sm text-gray-600">
                    Si votre compte était déjà activé, vous pouvez vous connecter directement
                  </p>
                </div>
              </div>
            )}

            {status === "idle" && token && (
              <div>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 mx-auto">
                    <Shield className="text-blue-600" size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Activer votre compte
                  </h2>
                  <p className="text-gray-600">
                    Choisissez un mot de passe pour terminer l’activation
                  </p>
                </div>

                {message && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="text-gray-400" size={18} />
                        ) : (
                          <Eye className="text-gray-400" size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="text-gray-400" size={18} />
                        ) : (
                          <Eye className="text-gray-400" size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <span>Confirmer et activer</span>
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? Contactez l'administrateur de votre établissement
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmAccount;
