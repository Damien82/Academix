import { useAuth } from "../../context/AuthContext"
import { Bell, Search, Settings, ChevronDown } from "lucide-react"

export default function AdminTopbar() {
  const { user } = useAuth()

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* SECTION GAUCHE : Barre de recherche style "Soft Matte" */}
      <div className="hidden md:flex items-center relative group">
        <Search className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une donnée, un utilisateur..." 
          className="w-80 bg-gray-200 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
        />
      </div>

      {/* SECTION DROITE : Actions & Profil */}
      <div className="flex items-center gap-5">
        
        {/* Notifications & Settings */}
        <div className="flex items-center gap-2 border-r border-slate-100 pr-5">
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* User Profile Card */}
        <button className="flex items-center gap-3 pl-2 py-1.5 pr-2 hover:bg-slate-50 rounded-2xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-slate-800 leading-none">
              {user?.fullName || "Administrateur"}
            </p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
              {user?.role}
            </p>
          </div>

          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] shadow-lg shadow-emerald-100 group-hover:rotate-3 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-emerald-700 text-sm border-2 border-white">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

      </div>
    </header>
  )
}