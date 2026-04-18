import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import LogoIcon from "./LogoIcon";
import { useAuth } from "../auth/AuthContext";

const Sidebar = ({ collapsed, setCollapsed, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const menuItems = [
    { id: "dashboard", icon: "home", label: "Tableau de bord" },
    { id: "elections", icon: "vote", label: "Élections" },
    { id: "participations", icon: "history", label: "Mes participations" },
    { id: "results", icon: "chart", label: "Résultats" },
  ];

  const icons = {
    home: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    vote: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m9 12 2 2 4-4" />
        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
        <path d="M22 19H2" />
      </svg>
    ),
    history: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    chart: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    logout: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    collapse: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    expand: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <LogoIcon size={28} />
          {!collapsed && <span className="sidebar-brand">E-Vote</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Agrandir" : "Réduire"}
        >
          {collapsed ? icons.expand : icons.collapse}
        </button>
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeMenu === item.id ? "active" : ""}`}
            onClick={() => setActiveMenu(item.id)}
            title={collapsed ? item.label : ""}
          >
            <span className="sidebar-icon">{icons[item.icon]}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="sidebar-item logout"
          onClick={handleLogout}
          title={collapsed ? "Déconnexion" : ""}
        >
          <span className="sidebar-icon">{icons.logout}</span>
          {!collapsed && <span className="sidebar-label">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
