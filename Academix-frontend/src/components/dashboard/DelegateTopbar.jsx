import { useAuth } from "../../context/AuthContext"
import { Bell, Search, Settings, ChevronDown, Sparkles } from "lucide-react"

export default function EleveTopbar() {
  const { user } = useAuth()

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-10 sticky top-0 z-40 font-sans">
      
      {/* SECTION GAUCHE : Recherche Contextuelle */}
      <div className="hidden md:flex items-center relative group">
        <Search className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un rapport, un cours..." 
          className="w-80 bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
        />
      </div>

      {/* SECTION DROITE : Notifications & Identité */}
      <div className="flex items-center gap-5">
        
        {/* Actions Rapides */}
        <div className="flex items-center gap-2 border-r border-slate-100 pr-5">
          <button className="p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* Profil de l'étudiant / Délégué */}
        <button className="flex items-center gap-4 pl-2 py-1.5 pr-1 hover:bg-slate-50/80 rounded-2xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-slate-900 leading-none tracking-tight">
              {user?.fullName || "Élève Délégué"}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <Sparkles size={10} className="text-emerald-500" />
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em]">
                {user?.role || "Étudiant"}
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Avatar avec Gradient Mat */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-[2px] shadow-lg shadow-emerald-100 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[13px] bg-white flex items-center justify-center font-black text-emerald-700 text-sm border-[3px] border-white">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
            {/* Indicateur de statut en ligne */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-y-0.5 transition-all" />
        </button>

      </div>
    </header>
  )
}