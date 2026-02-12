import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import config from "../config/app.config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Veuillez saisir votre adresse email");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      if (config.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStatus("success");
        setMessage("Un lien de réinitialisation a été envoyé à votre email.");
      } else {
        const response = await authService.forgotPassword(email);
        setStatus("success");
        setMessage(response?.message || "Un lien de réinitialisation a été envoyé à votre email.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Impossible d'envoyer le lien de réinitialisation.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showNav={false} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-2xl mb-6 mx-auto">
              <Mail className="text-white" size={30} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Entrez votre email pour recevoir un lien de réinitialisation
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votant@universite.bj"
                    disabled={status === "loading"}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all border-gray-300 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white rounded-lg font-semibold hover:from-[#0f2744] hover:to-[#1e3a5f] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le lien
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
