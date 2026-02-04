import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Vote,
  Users,
  UserCircle,
  BarChart3,
  ClipboardList,
  X,
  Menu,
  LogOut,
  Home,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import LogoIcon from "./LogoIcon";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Utilisateur par défaut pour le développement
  const currentUser = user || {
    firstName: "Admin",
    lastName: "System",
    email: "admin@universite.fr",
  };

  const menuItems = [
    { id: "dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, path: "/admin" },
    { id: "elections", label: "Élections", icon: Vote, path: "/admin/elections" },
    { id: "candidates", label: "Candidats", icon: Users, path: "/admin/candidats" },
    { id: "users", label: "Utilisateurs", icon: UserCircle, path: "/admin/utilisateurs" },
    { id: "results", label: "Résultats", icon: BarChart3, path: "/admin/resultats" },
    { id: "audit", label: "Journal d'audit", icon: ClipboardList, path: "/admin/audit" },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const getInitials = () => {
    return `${currentUser.firstName?.charAt(0) || ""}${currentUser.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar Professionnelle */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0f2744] via-[#1e3a5f] to-[#1a3550] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <LogoIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">E-Vote</h1>
              <p className="text-xs text-[#f59e0b] font-medium">Administration</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg shadow-amber-500/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ItemIcon size={20} className={active ? "text-white" : ""} />
                <span>{item.label}</span>
                {active && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Lien vers l'accueil */}
        <div className="px-4 mt-4">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all border border-white/10"
          >
            <Home size={18} />
            <span className="text-sm">Retour à l'accueil</span>
          </Link>
        </div>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-white/60 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-white/5 text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all border border-white/10"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar Professionnelle */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#1e3a5f] hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#1e3a5f]">
                  {menuItems.find((item) => isActive(item.path))?.label || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500">Gérez votre plateforme de vote électronique</p>
              </div>
            </div>

            {/* Actions header */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f59e0b] rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {getInitials()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>© 2026 E-Vote Administration. Tous droits réservés.</p>
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Système opérationnel
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
