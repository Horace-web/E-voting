import { useState } from "react";
import { Mail, ArrowRight, Loader2, Shield, Lock, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import config from "../config/app.config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // En mode mock, simuler l'envoi
      if (config.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] OTP envoyé à:", email);
      } else {
        // Appel API réel
        await authService.sendOTP(email);
      }

      // Stocker l'email dans sessionStorage pour la page OTP
      sessionStorage.setItem("otp_email", email);

      // Rediriger vers la page OTP avec rechargement complet
      window.location.href = "/otp";
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Erreur lors de l'envoi du code" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header showNav={true} />

      {/* Main Content */}
      <main className="flex-1 grid md:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full items-center">
        {/* Left Section - Info */}
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Accédez à vos scrutins</h1>
          <p className="text-lg text-gray-600">
            Connectez-vous en toute sécurité grâce à notre système d'authentification par code à
            usage unique (OTP).
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Authentification sécurisée</h3>
                <p className="text-sm text-gray-600">
                  Code unique envoyé par email, valable 10 minutes
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Données protégées</h3>
                <p className="text-sm text-gray-600">
                  Chiffrement de bout en bout pour vos informations
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vote anonyme garanti</h3>
                <p className="text-sm text-gray-600">
                  Votre identité et votre vote restent séparés
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section - Form */}
        <section>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Mail className="text-blue-600" size={28} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Connexion</h2>
            <p className="text-gray-600 text-center mb-6">
              Connectez-vous pour accéder à vos scrutins
            </p>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-gray-700">Continuer avec Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="votre.email@universite.fr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16304d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Envoi du code...
                  </>
                ) : (
                  <>
                    Envoyer le code OTP
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Pas encore de compte ?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#1e3a5f] hover:underline font-semibold"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
