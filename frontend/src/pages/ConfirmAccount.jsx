import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import config from "../config/app.config";

const ConfirmAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState(null); // {email, password}

  useEffect(() => {
    const confirmAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de confirmation manquant");
        return;
      }

      try {
        if (config.useMockData) {
          // Simulation confirmation
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("[MOCK] Confirmation token:", token);

          setCredentials({
            email: "electeur@universite.bj",
            password: "TempPass123!",
          });
          setStatus("success");
          setMessage("Votre compte a été activé avec succès !");
        } else {
          // Appel API réel
          const response = await authService.confirmAccount(token);
          setCredentials({
            email: response.email,
            password: response.password,
          });
          setStatus("success");
          setMessage(response.message || "Votre compte a été activé avec succès !");
        }
      } catch (error) {
        console.error("Erreur confirmation:", error);
        setStatus("error");
        
        if (error.response?.status === 404) {
          setMessage("Lien de confirmation invalide ou expiré");
        } else {
          setMessage(error.response?.data?.message || "Erreur lors de la confirmation");
        }
      }
    };

    confirmAccount();
  }, [token]);

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
            {/* Loading State */}
            {status === "loading" && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 mx-auto">
                  <Loader2 className="text-blue-600 animate-spin" size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Confirmation en cours...
                </h2>
                <p className="text-gray-600">
                  Veuillez patienter pendant que nous activons votre compte
                </p>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 mx-auto animate-bounce">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Compte activé !
                </h2>
                <p className="text-lg text-gray-600 mb-8">{message}</p>

                {/* Credentials Display */}
                {credentials && (
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] rounded-2xl p-8 mb-8 text-left">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="text-amber-400" size={28} />
                      <h3 className="text-xl font-bold text-white">
                        Vos identifiants de connexion
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Email */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="text-amber-400" size={20} />
                          <label className="text-sm font-medium text-white/80">
                            Adresse email
                          </label>
                        </div>
                        <p className="text-lg font-semibold text-white pl-8">
                          {credentials.email}
                        </p>
                      </div>

                      {/* Password */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Lock className="text-amber-400" size={20} />
                          <label className="text-sm font-medium text-white/80">
                            Mot de passe
                          </label>
                        </div>
                        <p className="text-lg font-mono font-bold text-white pl-8 tracking-wide">
                          {credentials.password}
                        </p>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-amber-500/20 border border-amber-400/30 rounded-xl">
                      <p className="text-sm text-amber-100 flex items-start gap-2">
                        <Shield className="flex-shrink-0 mt-0.5" size={16} />
                                <span>
                          <strong className="font-semibold">Important :</strong> Conservez précieusement ces identifiants. 
                          Vous pouvez copier le mot de passe et le coller lors de votre première connexion.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

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

            {/* Error State */}
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
