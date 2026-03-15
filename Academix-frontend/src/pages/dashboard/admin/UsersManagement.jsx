import { useState, useEffect } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { 
  Trash2, Search, User, ShieldCheck, Ban, Lock, Unlock, 
  AlertTriangle, CheckCircle2, Loader2, UserCog, ChevronDown 
} from "lucide-react"

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteUser, setDeleteUser] = useState(null)
  const [editRoleUser, setEditRoleUser] = useState(null) // État pour la modal de rôle
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = "https://academix-i3qb.onrender.com/api/users"
  const ROLES = ["student", "delegate"] // Liste des rôles disponibles

  // 1. Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (data.success) {
        // Sécurité : on ne gère pas les autres admins depuis cette interface
        const nonAdmins = data.users.filter(u => u.role !== 'admin')
        setUsers(nonAdmins)
      }
    } catch (err) {
      console.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  // 2. Filtrage
  const filteredUsers = users.filter((u) =>
    [u.fullName, u.email, u.role, u.filiere, u.classe].some(field => 
      field?.toLowerCase().includes(search.toLowerCase())
    )
  )

  // 3. Mise à jour du statut (Bloquer/Restreindre)
  const handleToggleStatus = async (userId, currentStatus, targetStatus) => {
    const newStatus = currentStatus === targetStatus ? "active" : targetStatus
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/${userId}/status`, {
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
      console.error("Erreur statut")
    }
  }

  // 4. Mise à jour du Rôle
  const handleUpdateRole = async (newRole) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/${editRoleUser._id}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      })
      
      if (res.ok) {
        setUsers(users.map(u => u._id === editRoleUser._id ? { ...u, role: newRole } : u))
        setEditRoleUser(null)
      }
    } catch (err) {
      console.error("Erreur mise à jour rôle")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5. Suppression
  const confirmDelete = async () => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/${deleteUser._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== deleteUser._id))
        setDeleteUser(null)
      }
    } catch (err) {
      console.error("Erreur suppression")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-full mx-auto space-y-10">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">Utilisateurs</h2>
                <p className="text-slate-500 font-medium mt-1">Gérez les permissions et les rôles des membres.</p>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un profil..."
                  className="pl-12 pr-4 py-3.5 bg-slate-100/50 border border-slate-200 rounded-2xl w-full md:w-96 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* --- TABLEAU --- */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4">
                  <Loader2 className="animate-spin text-emerald-600" size={40} />
                  <p className="font-bold uppercase text-[10px] tracking-widest">Chargement des données...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identité</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">État</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold border transition-colors ${
                                user.status === 'blocked' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {user.status === 'blocked' ? <Ban size={18} /> : <User size={20} />}
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{user.fullName}</p>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{user.filiere} • {user.classe}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm text-slate-600 font-bold">{user.email}</div>
                            <div className="text-[10px] text-slate-400 font-medium italic">ID: #{user._id.slice(-6).toUpperCase()}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border ${
                              user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              user.status === 'restricted' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              {user.status === 'active' ? 'Actif' : user.status === 'restricted' ? 'Restreint' : 'Bloqué'}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm">
                              <ShieldCheck size={12} /> {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-center gap-2">
                              {/* Modifier le Rôle */}
                              <button 
                                onClick={() => setEditRoleUser(user)}
                                className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100"
                                title="Modifier le rôle"
                              >
                                <UserCog size={18} strokeWidth={2.5} />
                              </button>

                              {/* Restreindre */}
                              <button 
                                onClick={() => handleToggleStatus(user._id, user.status, "restricted")}
                                className={`p-2.5 rounded-xl transition-all border ${
                                  user.status === 'restricted' 
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                                  : 'text-amber-600 bg-white border-amber-100 hover:bg-amber-50'
                                }`}
                                disabled={user.status === 'blocked'}
                              >
                                {user.status === 'restricted' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertTriangle size={18} strokeWidth={2.5} />}
                              </button>

                              {/* Bloquer */}
                              <button 
                                onClick={() => handleToggleStatus(user._id, user.status, "blocked")}
                                className={`p-2.5 rounded-xl transition-all border ${
                                  user.status === 'blocked'
                                  ? 'text-slate-900 bg-slate-200 border-slate-300'
                                  : 'text-slate-900 bg-white border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {user.status === 'blocked' ? <Unlock size={18} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.5} />}
                              </button>

                              <button 
                                onClick={() => setDeleteUser(user)}
                                className="p-2.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
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

      {/* --- MODAL MODIFICATION RÔLE --- */}
      {editRoleUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setEditRoleUser(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl border border-slate-100 animate-in zoom-in duration-300 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
              <UserCog size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">Modifier le rôle</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Pour {editRoleUser.fullName}</p>
            
            <div className="space-y-3 mb-10">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => handleUpdateRole(role)}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all flex items-center justify-between group ${
                    editRoleUser.role === role 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {role}
                  {editRoleUser.role === role && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setEditRoleUser(null)} 
              className="w-full py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL SUPPRESSION --- */}
      {deleteUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setDeleteUser(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl border border-slate-100 animate-in zoom-in duration-300 text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
              <Trash2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">Supprimer ?</h3>
            <p className="text-slate-500 text-sm mb-10 italic">"{deleteUser.fullName}"</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeleteUser(null)} className="py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-[11px] uppercase tracking-widest">Non</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="py-4 bg-rose-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-rose-200">
                {isSubmitting ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}