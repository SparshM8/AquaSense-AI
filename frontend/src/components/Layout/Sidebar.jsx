import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const nav = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/records", icon: "🗃️", label: "Water Records" },
  { to: "/ai", icon: "🤖", label: "AI Predictions" },
  { to: "/leakage", icon: "🚨", label: "Leakage Alerts" },
  { to: "/insights", icon: "🌿", label: "Sustainability" },
  { to: "/goals", icon: "🎯", label: "Goals & Board" },
  { to: "/reports", icon: "📄", label: "Reports" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">
            💧
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">
              AquaSense AI
            </div>

            <div className="text-xs text-gray-400">
              Water Intelligence
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-primary-light text-primary font-medium border-l-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Admin Link */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-red-50 text-red-600 font-medium border-l-2 border-red-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-base">🛡️</span>
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-medium text-primary">
            {user?.name
              ? user.name.substring(0, 2).toUpperCase()
              : "US"}
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user?.name || "Guest"}
            </div>

            <div className="text-xs text-gray-400 capitalize">
              {user?.role || "user"}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full text-xs text-gray-500 hover:text-red-600 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}