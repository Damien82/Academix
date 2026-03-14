import { useAuth } from "../../context/AuthContext"
import { Bell, Search, Settings, HelpCircle } from "lucide-react"

export default function EleveTopbar() {
  const { user } = useAuth()

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* SECTION RECHERCHE RAPIDE (Optionnelle mais très pro) */}
      <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
        <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Recherche rapide..." 
          className="bg-transparent border-none outline-none text-sm font-bold text-slate-600 placeholder:text-slate-400 w-64"
        />
      </div>

      {/* SECTION UTILISATEUR & NOTIFICATIONS */}
      <div className="flex items-center gap-8 ml-auto">
        
        {/* ICONES D'ACTION RAPIDE */}
        <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* PROFIL UTILISATEUR */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-emerald-600 transition-colors">
              {user?.email?.split('@')[0]}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                {user?.role || "Étudiant"}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] shadow-lg shadow-slate-200 group-hover:rotate-3 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="text-slate-900 font-black text-lg">
                  {user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  )
}