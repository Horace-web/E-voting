import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import config from "../config/app.config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("Token de réinitialisation manquant");
      return;
    }

    if (!password || password.length < 6) {
      setStatus("error");
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
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
        setMessage("Mot de passe mis à jour. Vous pouvez vous connecter.");
      } else {
        const response = await authService.resetPassword({
          token,
          password,
          password_confirmation: confirmPassword,
        });
        setStatus("success");
        setMessage(response?.message || "Mot de passe mis à jour. Vous pouvez vous connecter.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Impossible de réinitialiser le mot de passe.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showNav={false} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-2xl mb-6 mx-auto">
              <Lock className="text-white" size={30} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Réinitialiser le mot de passe
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Choisissez un nouveau mot de passe sécurisé
            </p>

            {status === "success" && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <CheckCircle size={18} className="mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all border-gray-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all border-gray-300 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold hover:from-[#0f2744] hover:to-[#1e3a5f] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    Enregistrer
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-[#1e3a5f] hover:text-[#16304d] font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
