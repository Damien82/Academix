import { useState } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { useAuth } from "../../../context/AuthContext"
import { Lock, X, Edit, Check, AlertCircle, Mail, User, ShieldCheck, Camera } from "lucide-react"

export default function AdminProfile() {
  const { user } = useAuth()

  const [editPassword, setEditPassword] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [profileData, setProfileData] = useState({
    name: user?.fullName || "Administrateur Principal",
    email: user?.email || "admin@institution.com",
  })

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      return
    }
    setEditPassword(false)
    setSuccessMessage("Mot de passe mis à jour avec succès.")
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Header section */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Mon Profil</h2>
                <p className="text-slate-500 font-medium mt-1">Gérez vos informations personnelles et la sécurité de votre compte.</p>
              </div>
            </div>

            {/* Profile Card Refonte */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-700 w-full" />
              
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
                      <Edit size={16} /> Modifier le profil
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                  {/* Info Column */}
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">{profileData.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                          <Mail size={14} /> {profileData.email}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg flex items-center gap-1">
                          <ShieldCheck size={12} /> {user?.role || "Admin"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-950">12</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rapports</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-950">05</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cours</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-950">08</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Membres</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Column */}
                  <div className="bg-slate-900 rounded-[24px] p-6 text-white flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-2">Sécurité</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Dernière modification : il y a 3 mois. Pensez à renouveler régulièrement votre mot de passe.</p>
                    </div>
                    <button
                      onClick={() => setEditPassword(true)}
                      className="mt-6 w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-900/20"
                    >
                      <Lock size={16} /> Nouveau mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* --- MODAL MODIFICATION --- */}
        {(editProfile || editPassword) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => { setEditProfile(false); setEditPassword(false); }} />
            <div className="relative bg-white rounded-[24px] w-full max-w-md p-10 shadow-xl border border-slate-100 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8 pb-3 border-b border-slate-100">
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                  {editProfile ? "Editer le profil" : "Sécurité compte"}
                </h3>
                <button onClick={() => { setEditProfile(false); setEditPassword(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-5">
                {editProfile ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nom complet</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none font-semibold transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">Adresse Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 outline-none font-semibold transition-all" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <input type="password" placeholder="Ancien mot de passe" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-700 font-semibold" />
                    <input type="password" placeholder="Nouveau mot de passe" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-700 font-semibold" />
                    <input type="password" placeholder="Confirmer nouveau" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-700 font-semibold" />
                  </>
                )}

                <div className="pt-6 flex gap-4 border-t border-slate-100">
                  <button onClick={() => { setEditProfile(false); setEditPassword(false); }} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-all hover:bg-slate-200">Annuler</button>
                  <button onClick={editProfile ? () => setEditProfile(false) : handlePasswordUpdate} className={`flex-1 py-3.5 ${editProfile ? 'bg-slate-900' : 'bg-emerald-700'} text-white font-bold rounded-xl text-sm shadow-lg transition-all active:scale-95`}>Mettre à jour</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modals (Success/Error) */}
        {successMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-xs">
            <div className="bg-white rounded-[24px] p-8 shadow-2xl border border-slate-100 flex flex-col items-center gap-4 text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><Check size={32} strokeWidth={3} /></div>
              <p className="font-bold text-slate-900 px-4">{successMessage}</p>
              <button onClick={() => setSuccessMessage("")} className="w-full mt-2 py-3 bg-slate-900 text-white font-bold rounded-xl">Continuer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}