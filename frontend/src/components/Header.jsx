import { useNavigate, useLocation } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import { useAuth } from "../auth/AuthContext";

const Header = ({ showNav = true, transparentOnTop = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/elections", label: "Scrutins" },
    { path: "/results", label: "Résultats" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-16 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center justify-center w-10 h-10 bg-[#1e3a5f] rounded-lg text-white">
            <LogoIcon size={26} />
          </span>
          <span className="text-2xl font-bold text-[#1e3a5f]">E-Vote</span>
        </button>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#1e3a5f]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div>
          {isAuthenticated && user ? (
            <button
              onClick={() => navigate("/electeur")}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-all"
            >
              Mon espace
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
