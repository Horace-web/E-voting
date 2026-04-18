import { useState, useRef, useEffect } from "react";
import { Shield, ArrowRight, Loader2, RefreshCw, Mail } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../auth/AuthContext";
import authService from "../services/auth.service";
import config from "../config/app.config";

const Otp = () => {
  const { login } = useAuth();

  // Récupérer l'email depuis sessionStorage
  const email = sessionStorage.getItem("otp_email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes en secondes
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Rediriger si pas d'email (uniquement au montage)
  useEffect(() => {
    if (!email) {
      window.location.href = "/login";
    }
  }, [email]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    // Autoriser seulement les chiffres
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Retour arrière
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Vérifier si c'est 6 chiffres
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setError("");
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setOtp(["", "", "", "", "", ""]);
    setError("");

    try {
      if (config.useMockData) {
        // Simulation renvoi OTP
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] OTP renvoyé à:", email);
      } else {
        await authService.resendOTP(email);
      }

      setTimeLeft(600); // Reset timer à 10 minutes
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du renvoi du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Veuillez saisir les 6 chiffres du code");
      return;
    }

    if (timeLeft <= 0) {
      setError("Le code a expiré. Veuillez demander un nouveau code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let userData;
      let role;

      if (config.useMockData) {
        // Simulation vérification OTP
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] OTP vérifié:", otpCode, "pour", email);

        // Simuler données utilisateur
        userData = {
          id: 1,
          firstName: "Jean",
          lastName: "Dupont",
          email: email,
        };

        // Simuler : si email contient "admin", c'est un admin, sinon électeur
        role = email.includes("admin") ? "admin" : "voter";
      } else {
        // Appel API réel
        const response = await authService.verifyOTP(email, otpCode);
        userData = response.user;
        role = response.user.role || "voter";
      }

      login(userData, role);

      // Nettoyer sessionStorage
      sessionStorage.removeItem("otp_email");

      // Récupérer la destination de redirection (si définie depuis la landing page)
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirection selon le rôle avec rechargement complet
      if (role === "admin") {
        window.location.href = "/admin";
      } else if (redirectPath && redirectPath.startsWith("/electeur")) {
        // Rediriger vers la page demandée (si c'est une page électeur valide)
        window.location.href = redirectPath;
      } else {
        window.location.href = "/electeur";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Code OTP invalide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header showNav={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 mx-auto">
              <Shield className="text-white" size={32} />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Vérification OTP
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Un code à 6 chiffres a été envoyé à <br />
              <span className="font-semibold text-[#1e3a5f]">{email}</span>
            </p>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                  timeLeft <= 60 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              {timeLeft <= 0 && (
                <span className="text-sm text-red-600 font-medium">Code expiré</span>
              )}
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      error
                        ? "border-red-300 bg-red-50"
                        : digit
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                    }`}
                    disabled={timeLeft <= 0}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || timeLeft <= 0}
                className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16304d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Vérification...
                  </>
                ) : (
                  <>
                    Vérifier le code
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading || timeLeft > 540} // Désactivé si > 9 min restantes
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} />
                Renvoyer le code
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors"
              >
                <Mail size={16} />
                Utiliser une autre adresse email
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Vous n'avez pas reçu le code ? Vérifiez vos spams ou contactez l'administrateur.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Otp;
