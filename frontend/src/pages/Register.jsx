import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Shield,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import Header from "../components/Header";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation des critères du mot de passe
  const passwordCriteria = useMemo(() => {
    const password = formData.password;
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordCriteria).every(Boolean);
  }, [passwordCriteria]);

  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Marquer le champ comme touché
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!isPasswordValid) {
      newErrors.password = "Le mot de passe ne respecte pas tous les critères";
    }

    if (!passwordsMatch) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marquer tous les champs comme touchés
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (validateForm()) {
      console.log("Register submitted:", formData);
      // Rediriger vers la page de connexion après inscription
      navigate("/login");
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Rejoignez la communauté</h1>
          <p className="text-lg text-gray-600">
            Créez votre compte en quelques secondes pour participer aux scrutins de votre
            institution.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserPlus className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Inscription simple</h3>
                <p className="text-sm text-gray-600">
                  Remplissez le formulaire ou connectez-vous avec Google
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Compte sécurisé</h3>
                <p className="text-sm text-gray-600">Vos données sont protégées et chiffrées</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vérification par email</h3>
                <p className="text-sm text-gray-600">Un lien de confirmation vous sera envoyé</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Accès immédiat</h3>
                <p className="text-sm text-gray-600">Participez aux scrutins dès la validation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section - Form */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
            <UserPlus className="text-white" size={28} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
          <p className="text-gray-600 mb-6">Inscrivez-vous pour participer aux scrutins</p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
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
            Continuer avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    touched.firstName && errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                  }`}
                />
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <X size={14} />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    touched.lastName && errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                  }`}
                />
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <X size={14} />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre.email@universite.fr"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  touched.email && errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    touched.password && !isPasswordValid
                      ? "border-red-300 bg-red-50"
                      : touched.password && isPasswordValid
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Critères de sécurité du mot de passe */}
              {(touched.password || formData.password) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Le mot de passe doit contenir :
                  </p>
                  <ul className="space-y-1.5">
                    <li
                      className={`text-xs flex items-center gap-2 ${
                        passwordCriteria.minLength ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {passwordCriteria.minLength ? (
                        <Check size={14} className="flex-shrink-0" />
                      ) : (
                        <X size={14} className="flex-shrink-0" />
                      )}
                      Au moins 8 caractères
                    </li>
                    <li
                      className={`text-xs flex items-center gap-2 ${
                        passwordCriteria.hasUppercase ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {passwordCriteria.hasUppercase ? (
                        <Check size={14} className="flex-shrink-0" />
                      ) : (
                        <X size={14} className="flex-shrink-0" />
                      )}
                      Une lettre majuscule (A-Z)
                    </li>
                    <li
                      className={`text-xs flex items-center gap-2 ${
                        passwordCriteria.hasLowercase ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {passwordCriteria.hasLowercase ? (
                        <Check size={14} className="flex-shrink-0" />
                      ) : (
                        <X size={14} className="flex-shrink-0" />
                      )}
                      Une lettre minuscule (a-z)
                    </li>
                    <li
                      className={`text-xs flex items-center gap-2 ${
                        passwordCriteria.hasNumber ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {passwordCriteria.hasNumber ? (
                        <Check size={14} className="flex-shrink-0" />
                      ) : (
                        <X size={14} className="flex-shrink-0" />
                      )}
                      Un chiffre (0-9)
                    </li>
                    <li
                      className={`text-xs flex items-center gap-2 ${
                        passwordCriteria.hasSpecial ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {passwordCriteria.hasSpecial ? (
                        <Check size={14} className="flex-shrink-0" />
                      ) : (
                        <X size={14} className="flex-shrink-0" />
                      )}
                      Un caractère spécial (!@#$%^&*...)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    touched.confirmPassword && !passwordsMatch
                      ? "border-red-300 bg-red-50"
                      : touched.confirmPassword && passwordsMatch
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.confirmPassword && formData.confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X size={14} />
                  Les mots de passe ne correspondent pas
                </p>
              )}
              {touched.confirmPassword && passwordsMatch && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <Check size={14} />
                  Les mots de passe correspondent
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isPasswordValid || !passwordsMatch}
              className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16304d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer mon compte
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Se connecter
            </button>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Register;
