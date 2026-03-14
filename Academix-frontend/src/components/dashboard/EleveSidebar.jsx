import {
  LayoutDashboard,
  FileText,
  HomeIcon,
  LogOut,
  GraduationCap,
  User2Icon,
  List,
  ChevronRight
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function EleveSidebar() {
  const { logout, user } = useAuth() // On suppose que 'user' contient les infos de l'étudiant

  // Style High-End : Mat & Professional
  const linkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500 group relative
     ${isActive
       ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
       : "text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-700"
     }`

  return (
    <aside className="w-80 bg-[#FBFBFC] h-screen p-8 flex flex-col border-r border-slate-200/60 shadow-sm">
      
      {/* BRANDING : Style "Iconic" identique à l'admin */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-20 rounded-full"></div>
          <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <GraduationCap className="text-emerald-600" size={26} strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Academix
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Étudiant</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Menu Principal</p>
        
        <NavLink to="/dashboard/student" end className={linkClass}>
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} strokeWidth={2} />
            <span className="text-[15px] font-bold">Tableau de bord</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </NavLink>

        <NavLink to="/dashboard/student/reports" className={linkClass}>
          <div className="flex items-center gap-3">
            <FileText size={20} strokeWidth={2} />
            <span className="text-[15px] font-bold">Mes Rapports</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </NavLink>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-10 mb-4 px-4">Navigation</p>

        <NavLink to="/dashboard/student/profile" className={linkClass}>
          <div className="flex items-center gap-3">
            <User2Icon size={20} strokeWidth={2} />
            <span className="text-[15px] font-bold">Mon Profil</span>
          </div>
        </NavLink>

        <NavLink to="/" className={linkClass}>
          <div className="flex items-center gap-3">
            <HomeIcon size={20} strokeWidth={2} />
            <span className="text-[15px] font-bold">Accueil</span>
          </div>
        </NavLink>

        <NavLink to="/catalogue" className={linkClass}>
          <div className="flex items-center gap-3">
            <List size={20} strokeWidth={2} />
            <span className="text-[15px] font-bold">Catalogue</span>
          </div>
        </NavLink>
      </nav>

      {/* USER CARD : Mini-fiche étudiant pour la déconnexion */}
      <div className="mt-auto pt-8">
        <div className="bg-slate-900 rounded-[32px] p-5 relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-900/20">
                {/* Dynamiser les initiales si possible */}
                ET
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-black leading-none tracking-tight">Étudiant</span>
                <span className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-tighter italic opacity-70">En ligne</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 bg-white/5 hover:bg-red-500 text-slate-400 hover:text-white rounded-xl transition-all duration-300 active:scale-90"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
          {/* Décoration de fond interactive */}
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        </div>
      </div>
    </aside>
  )
}