import { useState, useEffect } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { Trash2, Search, User, ShieldCheck, Ban, Lock, Unlock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteUser, setDeleteUser] = useState(null)

  // 1. Charger les utilisateurs depuis l'API
// Dans ton useEffect ou fetchUsers du frontend
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (data.success) {
      // Sécurité frontend : on ne garde que ceux qui ne sont pas admin
      const nonAdmins = data.users.filter(u => u.role !== 'admin');
      setUsers(nonAdmins);
    }
  } catch (err) {
    console.error("Erreur de synchronisation");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchUsers() }, [])

  // 2. Filtrage
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role, u.filiere, u.classe].some(field => 
      field?.toLowerCase().includes(search.toLowerCase())
    )
  )

  // 3. Mise à jour du statut (API)
  const handleToggleStatus = async (userId, currentStatus, targetStatus) => {
    // Si on reclique sur le même bouton, on repasse en 'active', sinon on applique le target
    const newStatus = currentStatus === targetStatus ? "active" : targetStatus
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
      }
    } catch (err) {
      console.error("Erreur de mise à jour statut")
    }
  }

  // 4. Suppression (API)
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/users/${deleteUser._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== deleteUser._id))
        setDeleteUser(null)
      }
    } catch (err) {
      console.error("Erreur de suppression")
    }
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-full mx-auto space-y-10">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Utilisateurs</h2>
                <p className="text-slate-600 font-medium mt-1">Gérez les accès et les restrictions des profils en temps réel.</p>
              </div>

              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Nom, email, filière..."
                  className="pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl w-full md:w-96 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* --- TABLEAU OU LOADER --- */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="animate-spin" size={40} />
                  <p className="font-medium">Synchronisation avec la base de données...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200">
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Identité</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Contact</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">État</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Rôle</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">Gestion des accès</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className={`hover:bg-slate-50/50 transition-colors ${user.status === 'blocked' ? 'bg-rose-50/20' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                user.status === 'blocked' ? 'bg-rose-100 text-rose-600' : 
                                user.status === 'restricted' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {user.status === 'blocked' ? <Ban size={18} /> : <User size={20} />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{user.fullName}</p>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                                  {user.filiere} • {user.classe}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-700 font-medium">{user.email}</div>
                            <div className="text-xs text-slate-400 font-medium italic">ID: #{user._id.slice(-6)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                              user.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              user.status === 'restricted' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              'bg-rose-100 text-rose-700 border-rose-200'
                            }`}>
                              {user.status === 'active' ? 'Actif' : user.status === 'restricted' ? 'Restreint' : 'Bloqué'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-tight">
                              <ShieldCheck size={12} /> {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              {/* Bouton Restreindre */}
                              <button 
                                onClick={() => handleToggleStatus(user._id, user.status, "restricted")}
                                className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                                  user.status === 'restricted' 
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                                  : 'text-amber-600 bg-white border-amber-100 hover:bg-amber-50'
                                }`}
                                disabled={user.status === 'blocked'}
                              >
                                {user.status === 'restricted' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertTriangle size={18} strokeWidth={2.5} />}
                              </button>

                              {/* Bouton Bloquer */}
                              <button 
                                onClick={() => handleToggleStatus(user._id, user.status, "blocked")}
                                className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                                  user.status === 'blocked'
                                  ? 'text-slate-900 bg-slate-200 border-slate-300 hover:bg-slate-300'
                                  : 'text-slate-900 bg-white border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {user.status === 'blocked' ? <Unlock size={18} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.5} />}
                              </button>

                              <div className="w-[1px] h-6 bg-slate-200 mx-1" />

                              {/* Bouton Supprimer */}
                              <button 
                                onClick={() => setDeleteUser(user)}
                                className="p-2.5 text-rose-600 bg-white border border-rose-100 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 size={18} strokeWidth={2.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL SUPPRESSION --- */}
      {deleteUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDeleteUser(null)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-8 shadow-xl border border-slate-100 animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-200">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-2">Supprimer définitivement ?</h3>
            <p className="text-slate-600 text-sm mb-8 px-2">
              L'utilisateur <span className="font-bold text-slate-800">{deleteUser.fullName}</span> sera radié de la base de données.
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <button onClick={() => setDeleteUser(null)} className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm">Annuler</button>
              <button onClick={confirmDelete} className="py-3.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-sm transition-all text-sm">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}