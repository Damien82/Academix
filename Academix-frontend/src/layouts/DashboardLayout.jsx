import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-emerald-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-emerald-600">
          Dashboard Étudiant
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard/student"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-emerald-600" : "hover:bg-emerald-600"
              }`
            }
          >
            👤 Profil
          </NavLink>

          <NavLink
            to="/dashboard/student/stage"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-emerald-600" : "hover:bg-emerald-600"
              }`
            }
          >
            📄 Rapport de stage
          </NavLink>

          <NavLink
            to="/dashboard/student/projets"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-emerald-600" : "hover:bg-emerald-600"
              }`
            }
          >
            📘 Projets scolaires
          </NavLink>
        </nav>

        <div className="p-4 border-t border-emerald-600">
          <p className="text-sm mb-2">{user?.name}</p>
          <button
            onClick={logout}
            className="w-full bg-white text-emerald-700 py-2 rounded font-semibold"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
