import {
  LayoutDashboard,
  FileText,
  BookOpen,
  LogOut,
  GraduationCap,
  User2Icon,
  HomeIcon,
  List
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function AdminSidebar() {
  const { logout } = useAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold
     ${isActive
       ? "bg-gray-100 text-black shadow"
       : "text-black hover:bg-emerald-50 "
     }`

  return (
    <aside className="w-72 bg-emerald-500 shadow-md p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <GraduationCap className="text-white" size={28} />
        <h1 className="text-xl font-bold text-white">
          Academix Délegué
        </h1>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        <NavLink to="/dashboard/delegate" end className={linkClass}>
          <LayoutDashboard size={20} />
          Tableau de bord
        </NavLink>

        <NavLink to="/dashboard/delegate/reports" className={linkClass}>
          <FileText size={20} />
          Rapports
        </NavLink>

        <NavLink to="/dashboard/delegate/courses" className={linkClass}>
          <BookOpen size={20} />
          Cours
        </NavLink>

        <NavLink to="/dashboard/delegate/profile" className={linkClass}>
          <User2Icon size={20} />
          Profile
        </NavLink>

        <NavLink to="/" className={linkClass}>
          <HomeIcon size={20} />
          Acceuil
        </NavLink>

        <NavLink to="/catalogue" className={linkClass}>
          <List size={20} />
          Catalogue
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center bg-red-200 gap-3 text-red-500 mt-12 px-4 py-3 hover:bg-red-300 rounded-xl w-full font-medium"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </aside>
  )
}
