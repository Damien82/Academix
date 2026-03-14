import { useState } from "react"
import EleveSidebar from "../../../components/dashboard/EleveSidebar"
import EleveTopbar from "../../../components/dashboard/EleveTopbar"
import { useAuth } from "../../../context/AuthContext"
import { Lock, X, Edit, Check, AlertCircle, Mail, User, ShieldCheck, Camera, GraduationCap, FileText } from "lucide-react"

export default function EleveProfile() {
  const { user } = useAuth()

  const [editPassword, setEditPassword] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [profileData, setProfileData] = useState({
    name: user?.fullName || "Élève Utilisateur",
    email: user?.email || "eleve@institution.com",
  })

  // 🔹 Stats de l'élève
  const stats = {
    rapportsSoumis: 8,
    coursDisponibles: 12,
  }

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      return
    }
    setEditPassword(false)
    setSuccessMessage("Mot de passe mis à jour avec succès.")
    setPasswords({ current: "", new: "", confirm: "" })
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <EleveSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EleveTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Header section */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Mon Profil Étudiant</h2>
                <p className="text-slate-500 font-medium mt-1">Gérez vos informations et suivez votre progression académique.</p>
              </div>
            </div>

            {/* Profile Card Style "Mat" */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
              <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 w-full" />
              
              <div className="px-10 pb-10">
                <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="relative group w-32 h-32">
                    <div className="w-full h-full rounded-[24px] bg-white p-1.5 shadow-lg">
                      <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center text-white text-4xl font-black">
                        {profileData.name?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <button className="absolute bottom-2 right-2 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditProfile(true)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 text-sm"
                    >
                      <Edit size={16} /> Modifier les infos
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                  {/* Info Column */}
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950 tracking-tight">{profileData.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                          <Mail size={14} className="text-slate-400" /> {profileData.email}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border border-emerald-100">
                          <GraduationCap size={12} /> Étudiant
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                        <FileText className="text-slate-300 group-hover:text-emerald-500 mb-2 transition-colors" size={20} />
                        <p className="text-2xl font-black text-slate-950">{stats.rapportsSoumis}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rapports Soumis</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                        <ShieldCheck className="text-slate-300 group-hover:text-emerald-500 mb-2 transition-colors" size={20} />
                        <p className="text-2xl font-black text-slate-950">{stats.coursDisponibles}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cours Actifs</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Column - Style Sombre Mat */}
                  <div className="bg-slate-900 rounded-[28px] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                    <div>
                      <h4 className="font-bold text-lg mb-2">Accès & Sécurité</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Protégez votre compte étudiant en utilisant un mot de passe complexe.</p>
                    </div>
                    <button
                      onClick={() => setEditPassword(true)}
                      className="mt-8 w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-900/20 active:scale-95"
                    >
                      <Lock size={16} /> Changer le code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* --- MODALES (IDENTIQUES AU STYLE ADMIN POUR LA COHÉRENCE) --- */}
        {(editProfile || editPassword) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => { setEditProfile(false); setEditPassword(false); }} />
            <div className="relative bg-white rounded-[32px] w-full max-w-md p-10 shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                  {editProfile ? "Editer Profil" : "Sécurité"}
                </h3>
                <button onClick={() => { setEditProfile(false); setEditPassword(false); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-5">
                {editProfile ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nom complet</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none font-bold transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email académique</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none font-bold transition-all" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <input type="password" placeholder="Mot de passe actuel" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold" />
                    <input type="password" placeholder="Nouveau mot de passe" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold" />
                    <input type="password" placeholder="Confirmer le nouveau" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold" />
                  </div>
                )}

                <div className="pt-6 flex gap-4">
                  <button onClick={() => { setEditProfile(false); setEditPassword(false); }} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-xl text-xs hover:bg-slate-200 transition-all">Annuler</button>
                  <button onClick={editProfile ? () => {setEditProfile(false); setSuccessMessage("Profil mis à jour");} : handlePasswordUpdate} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-xl text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Confirmer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- FEEDBACK MODALS --- */}
        {successMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-xs">
            <div className="bg-white rounded-[32px] p-10 shadow-2xl border border-slate-100 flex flex-col items-center gap-4 text-center animate-in zoom-in duration-200 max-w-xs w-full">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><Check size={40} strokeWidth={3} /></div>
              <p className="font-black text-slate-900 text-lg tracking-tight">{successMessage}</p>
              <button onClick={() => setSuccessMessage("")} className="w-full mt-4 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95">Continuer</button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-xs">
            <div className="bg-white rounded-[32px] p-10 shadow-2xl border border-slate-100 flex flex-col items-center gap-4 text-center animate-in zoom-in duration-200 max-w-xs w-full">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2"><AlertCircle size={40} strokeWidth={3} /></div>
              <p className="font-black text-slate-900 text-lg tracking-tight">{errorMessage}</p>
              <button onClick={() => setErrorMessage("")} className="w-full mt-4 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95">Réessayer</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}