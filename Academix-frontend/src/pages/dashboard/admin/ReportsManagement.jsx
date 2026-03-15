import { useState, useEffect } from "react"
import axios from "axios"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { FileText, Trash2, Eye, X, Edit, Search, Phone, Calendar, UserCheck, Loader2 } from "lucide-react"

export default function ReportsManagement() {
  // --- ÉTATS ---
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // États pour les Modals
  const [deleteReport, setDeleteReport] = useState(null)
  const [editReport, setEditReport] = useState(null)
  
  // États pour le formulaire de modification
  const [editedTitle, setEditedTitle] = useState("")
  const [editedSupervisor, setEditedSupervisor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = "https://academix-i3qb.onrender.com/api/reports"
  const token = localStorage.getItem('token')

  // --- ACTIONS API ---

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(response.data.reports)
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await axios.delete(`${API_URL}/${deleteReport._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.filter((r) => r._id !== deleteReport._id))
      setDeleteReport(null)
    } catch (error) {
      alert("Erreur lors de la suppression du rapport.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSave = async () => {
    if (!editedTitle.trim()) return;
    try {
      setIsSubmitting(true)
      const response = await axios.patch(`${API_URL}/${editReport._id}`, 
        { title: editedTitle, supervisor: editedSupervisor },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      
      if (response.data.success || response.status === 200) {
        setReports(reports.map((r) => 
          r._id === editReport._id ? { ...r, title: editedTitle, supervisor: editedSupervisor } : r
        ))
        setEditReport(null)
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour.")
    } finally {
      setIsSubmitting(false)
    }
  }
  // Fonction pour forcer le téléchargement avec le nom correct
const handleDownload = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Erreur réseau");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Ajout de l'extension .pdf par défaut si absente du titre
    const finalFileName = fileName.toLowerCase().endsWith('.pdf') 
      ? fileName 
      : `${fileName}.pdf`;
      
    link.setAttribute('download', finalFileName);
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur de téléchargement:", error);
    // Repli : ouvrir dans un nouvel onglet si le fetch échoue (ex: CORS)
    window.open(fileUrl, '_blank');
  }
};

  // --- LOGIQUE UI ---
  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.student.toLowerCase().includes(search.toLowerCase()) ||
    r.supervisor.toLowerCase().includes(search.toLowerCase())
  )

  const isToday = (dateStr) => {
    const today = new Date().toDateString();
    const reportDate = new Date(dateStr).toDateString();
    return today === reportDate;
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-full mx-auto space-y-10">
            
            {/* --- EN-TÊTE --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Gestion des rapports</h2>
                <p className="text-slate-600 font-medium mt-1">Données synchronisées avec le serveur Cloudinary.</p>
              </div>

              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un rapport, étudiant, encadrant..."
                  className="pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl w-full md:w-96 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* --- TABLEAU --- */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-emerald-700" size={40} />
                    <p className="text-slate-500 font-bold">Chargement des rapports...</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200">
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Document</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Étudiant / Contact</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Encadrant</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Cursus</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Date de Publication</th>
                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReports.map((report) => (
                        <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-inner shrink-0">
                                <FileText size={20} />
                              </div>
                              <span className="font-bold text-slate-900 text-sm leading-tight">{report.title}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{report.student}</span>
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                <Phone size={10} /> {report.tel || "N/A"}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <UserCheck size={30} className="text-emerald-600" />
                              {report.supervisor}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded uppercase">
                                {report.niveau}
                              </span>
                              <span className="text-sm font-bold text-slate-700">{report.filiere}</span>
                              <span className="text-[10px] font-bold text-slate-500">{report.classe}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                <Calendar size={14} className="text-slate-400" />
                                {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Date inconnue"}
                              </div>
                              {report.createdAt && isToday(report.createdAt) && (
                                <span className="w-fit px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                                  Récent
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditReport(report)
                                  setEditedTitle(report.title)
                                  setEditedSupervisor(report.supervisor)
                                }}
                                className="p-2.5 text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all"
                              >
                                <Edit size={16} strokeWidth={2.5} />
                              </button>
                              <button 
                                onClick={() => setDeleteReport(report)}
                                className="p-2.5 text-rose-900 bg-rose-100 hover:bg-rose-200 rounded-xl transition-all"
                              >
                                <Trash2 size={16} strokeWidth={2.5} />
                              </button>
                              <button 
                                onClick={() => handleDownload(report.fileUrl, report.title)}
                                className="p-2.5 text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all flex items-center shadow-sm"
                                title="Télécharger le rapport"
                              >
                                <Eye size={16} strokeWidth={2.5} />
                              </button>
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
      </div>

      {/* --- MODAL SUPPRESSION --- */}
      {deleteReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isSubmitting && setDeleteReport(null)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-8 shadow-xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-200">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 text-center mb-2">Supprimer ?</h3>
            <p className="text-slate-600 text-center text-sm mb-8">Confirmez-vous la suppression du rapport <br/><span className="font-bold text-slate-800">"{deleteReport.title}"</span> ?</p>
            <div className="grid grid-cols-2 gap-3.5">
              <button 
                disabled={isSubmitting}
                onClick={() => setDeleteReport(null)} 
                className="py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                disabled={isSubmitting}
                onClick={handleDelete} 
                className="py-3.5 bg-rose-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL MODIFICATION --- */}
      {editReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditReport(null)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-md p-10 shadow-xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8 pb-3 border-b border-slate-100">
              <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">Modifier le rapport</h3>
              <button onClick={() => setEditReport(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Titre du rapport</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-700 font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Encadrant (Superviseur)</label>
                <input
                  type="text"
                  value={editedSupervisor}
                  onChange={(e) => setEditedSupervisor(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-700 font-semibold"
                />
              </div>
              <div className="pt-6 flex gap-4 border-t border-slate-100">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setEditReport(null)} 
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleEditSave} 
                  className="flex-1 py-3.5 bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}