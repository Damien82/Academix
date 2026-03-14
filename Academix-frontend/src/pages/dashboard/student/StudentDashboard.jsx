import { useState, useEffect } from "react"
import axios from "axios"
import DelegueSidebar from "../../../components/dashboard/EleveSidebar"
import AdminTopbar from "../../../components/dashboard/EleveTopbar"
import { 
  FileText, Book, Eye, Edit, Trash2, X, Search, CheckCircle, 
  Clock, Loader2, AlertCircle, Download, LayoutGrid
} from "lucide-react"

export default function DelegueDashboard() {
  // --- ÉTATS ---
  const [reports, setReports] = useState([])
  const [courses, setCourses] = useState([]) // État pour les cours totaux
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editReport, setEditReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)
  const [editValues, setEditValues] = useState({ title: "", language: "Français" })
  const [error, setError] = useState(null)

  // Configuration API
  const API_URL = "http://localhost:5000/api"
  const token = localStorage.getItem('token')

  // --- LOGIQUE BACKEND ---

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Chargement simultané des rapports personnels et de tous les cours
      const [reportsRes, coursesRes] = await Promise.all([
        axios.get(`${API_URL}/reports/mine`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (reportsRes.data.success) setReports(reportsRes.data.reports)
      if (coursesRes.data.success) setCourses(coursesRes.data.courses)
      
    } catch (err) {
      setError("Échec de la synchronisation des données")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchDashboardData()
  }, [])

  const handleEditSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/reports/${editReport._id}`, editValues, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        setReports(reports.map((r) => r._id === editReport._id ? res.data.report : r))
        setEditReport(null)
      }
    } catch (err) { alert("Erreur lors de la modification") }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/reports/${deleteReport._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.filter((r) => r._id !== deleteReport._id))
      setDeleteReport(null)
    } catch (err) { alert("Erreur lors de la suppression") }
  }

  // --- LOGIQUE INTERNE ---
  const handleEditOpen = (report) => {
    setEditReport(report)
    setEditValues({ title: report.title, language: report.language })
  }

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = { 
    rapports: reports.length, 
    coursTotaux: courses.length, 
    valides: reports.filter(r => r.status === "validated").length 
  }

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans selection:bg-emerald-100">
      <DelegueSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full text-slate-900">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto space-y-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Espace Étudiant</h2>
                <p className="text-slate-500 font-medium mt-2 italic">Visualisez vos rapports et accédez aux ressources de cours.</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard title="Mes dépôts" value={stats.rapports} icon={<FileText size={22} />} color="emerald" />
              <StatCard title="Rapports validés" value={stats.valides} icon={<CheckCircle size={22} />} color="blue" />
              <StatCard title="Cours disponibles" value={stats.coursTotaux} icon={<Book size={22} />} color="orange" />
            </div>

            {/* --- SECTION VISUALISATION DES COURS --- */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <LayoutGrid size={24} className="text-orange-500" />
                  Supports de cours récents
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[32px]" />)
                ) : courses.length > 0 ? (
                  courses.slice(0, 6).map((course) => (
                    <div key={course._id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                          <Book size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 leading-tight">{course.title}</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">{course.module || "Général"}</p>
                        </div>
                      </div>
                      <a href={course.fileUrl} download className="p-3 bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white rounded-xl transition-all">
                        <Download size={18} />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-slate-400 font-medium py-10">Aucun cours disponible pour le moment.</p>
                )}
              </div>
            </section>

            {/* --- SECTION TABLEAU DES RAPPORTS --- */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden group transition-all hover:shadow-xl hover:shadow-slate-200/50">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mes derniers dépôts</h3>
                <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un de mes rapports..."
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronisation...</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20 text-rose-500 gap-2">
                    <AlertCircle size={32} />
                    <span className="font-bold">{error}</span>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-8 py-5">Titre & Date</th>
                        <th className="px-8 py-5">Filière / Classe</th>
                        <th className="px-8 py-5">Langue</th>
                        <th className="px-8 py-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
                      {filteredReports.map((report) => (
                        <tr key={report._id} className="hover:bg-slate-50/80 transition-colors group/row">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={18} /></div>
                              <div>
                                <p className="text-slate-900 font-black mb-1.5">{report.title}</p>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold italic">
                                  <Clock size={12} /> {new Date(report.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-slate-800 font-black uppercase tracking-tighter">{report.filiere}</span>
                            <span className="mx-2 text-slate-200">|</span>
                            <span className="text-slate-400 font-bold">{report.classe}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${report.language === 'Français' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                              {report.language}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-3">
                              <ActionButton onClick={() => handleEditOpen(report)} icon={<Edit size={16} />} color="blue" />
                              <ActionButton onClick={() => setDeleteReport(report)} icon={<Trash2 size={16} />} color="red" />
                              <a href={report.fileUrl} target="_blank" rel="noreferrer">
                                <ActionButton icon={<Eye size={16} />} color="emerald" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* --- MODALS --- */}
        <Modal isVisible={!!editReport} onClose={() => setEditReport(null)} title="Modifier le document">
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Titre du projet</label>
                <input type="text" value={editValues.title} onChange={(e) => setEditValues({ ...editValues, title: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setEditReport(null)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 bg-slate-100 rounded-2xl">Annuler</button>
                <button onClick={handleEditSave} className="flex-1 py-4 text-xs font-black uppercase bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 shadow-xl transition-all">Enregistrer</button>
              </div>
           </div>
        </Modal>

        {deleteReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] w-full max-w-sm p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">Supprimer ?</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed italic">"{deleteReport.title}"</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteReport(null)} className="flex-1 py-4 text-xs font-black uppercase bg-slate-100 text-slate-400 rounded-2xl">Annuler</button>
                <button onClick={handleDelete} className="flex-1 py-4 text-xs font-black uppercase bg-red-600 text-white rounded-2xl shadow-lg transition-all">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- SOUS-COMPOSANTS ---

function StatCard({ title, value, icon, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100/50",
    blue: "bg-blue-50 text-blue-600 ring-blue-100/50",
    orange: "bg-orange-50 text-orange-600 ring-orange-100/50",
  }
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100/60 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 mb-6 ${colors[color]}`}>{icon}</div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform">{value}</h3>
    </div>
  )
}

function ActionButton({ onClick, icon, color }) {
  const themes = {
    blue: "text-blue-600 hover:bg-blue-600 hover:border-blue-600",
    red: "text-red-600 hover:bg-red-600 hover:border-red-600",
    emerald: "text-emerald-600 hover:bg-emerald-600 hover:border-emerald-600",
  }
  return (
    <button onClick={onClick} className={`p-3 bg-white border border-slate-100 rounded-2xl hover:text-white shadow-sm transition-all active:scale-90 ${themes[color]}`}>{icon}</button>
  )
}

function Modal({ isVisible, onClose, title, children }) {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-10 text-slate-900">
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}