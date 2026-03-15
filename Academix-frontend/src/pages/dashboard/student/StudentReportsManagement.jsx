import { useState, useEffect } from "react"
import axios from "axios"
import EleveSidebar from "../../../components/dashboard/EleveSidebar"
import EleveTopbar from "../../../components/dashboard/EleveTopbar"
import { 
  FileText, Edit, Trash2, X, Plus, Eye, 
  Search, Calendar, UserCheck, UploadCloud, Loader2, AlertCircle, CheckCircle2
} from "lucide-react"

export default function MesRapports() {
  // --- ÉTATS ---
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState({ type: "", msg: "" })
  
  // Modaux
  const [addReport, setAddReport] = useState(false)
  const [editReport, setEditReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)

  // Formulaire
  const [formValues, setFormValues] = useState({ 
    title: "", supervisor: "", classe: "", filiere: "GL", niveau: "L3", date: "", language: "Français", tel: "673730091" 
  })
  const [selectedFile, setSelectedFile] = useState(null)

  const API_URL = "https://academix-i3qb.onrender.com/api/reports"
  const token = localStorage.getItem('token')

  // --- LOGIQUE API ---
  const showStatus = (type, msg) => {
    setStatus({ type, msg })
    setTimeout(() => setStatus({ type: "", msg: "" }), 4000)
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) setReports(res.data.reports)
    } catch (err) {
      showStatus("error", "Impossible de charger vos rapports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

 const handleAddReport = async () => {
  if (!formValues.title || !selectedFile) return showStatus("error", "Le titre et le PDF sont obligatoires")
  
  // Validation du poids (10 Mo max)
  if (selectedFile.size > 10 * 1024 * 1024) {
    return showStatus("error", "Le fichier est trop volumineux (max 10 Mo)")
  }

  try {
    setIsSubmitting(true)
    setUploadProgress(0) // Réinitialisation

    const formData = new FormData()
    Object.keys(formValues).forEach(key => formData.append(key, formValues[key]))
    formData.append("file", selectedFile)

    const res = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data', 
        Authorization: `Bearer ${token}` 
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percentCompleted)
      }
    })

    if (res.data.success) {
      setReports([res.data.report, ...reports])
      setAddReport(false)
      resetForm()
      showStatus("success", "Rapport soumis avec succès")
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Échec de l'envoi"
    showStatus("error", errorMsg)
  } finally {
    setIsSubmitting(false)
    setUploadProgress(0)
  }
}

  const handleEditSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/${editReport._id}`, editReport, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.map(r => r._id === editReport._id ? res.data.report : r))
      setEditReport(null)
      showStatus("success", "Mise à jour réussie")
    } catch (err) {
      showStatus("error", "Erreur de modification")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteReport._id}`, { headers: { Authorization: `Bearer ${token}` } })
      setReports(reports.filter(r => r._id !== deleteReport._id))
      setDeleteReport(null)
      showStatus("success", "Rapport supprimé")
    } catch (err) {
      showStatus("error", "Action impossible")
    }
  }

  const resetForm = () => {
    setFormValues({ title: "", supervisor: "", classe: "", filiere: "GL", niveau: "L3", date: "", language: "Français", tel: "673730091" })
    setSelectedFile(null)
  }

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.supervisor?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <EleveSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EleveTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          {/* TOAST NOTIFICATION */}
          {status.msg && (
            <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right ${status.type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-rose-600 border-rose-400 text-white"}`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{status.msg}</span>
            </div>
          )}

          <div className="max-w-full mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">Mes Rapports</h2>
                <p className="text-slate-500 font-medium mt-1">Gérez vos documents académiques.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group hidden lg:block">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." className="pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl w-64 text-sm focus:border-emerald-500 outline-none font-bold transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { resetForm(); setAddReport(true); }} className="px-6 py-3.5 flex items-center gap-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
                  <Plus size={18} strokeWidth={3} /> Nouveau Rapport
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Document</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Encadrant</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Cursus</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-emerald-600" /></td></tr>
                    ) : filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                              <FileText size={20} />
                            </div>
                            <span className="font-bold text-slate-900">{report.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-600">
                          <div className="flex items-center gap-2"><UserCheck size={16} className="text-emerald-500" /> {report.supervisor || "Non assigné"}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded uppercase">{report.niveau}</span>
                            <span className="text-sm font-bold text-slate-700">{report.filiere}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                            <Calendar size={14} /> {report.date}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setEditReport(report)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Edit size={16} /></button>
                            <button onClick={() => setDeleteReport(report)} className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                            <a href={report.fileUrl} target="_blank" rel="noreferrer" className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"><Eye size={16} /></a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL AJOUT / MODIF */}
      {(addReport || editReport) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => { setAddReport(false); setEditReport(null); }} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl border border-slate-100 animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-slate-900 mb-8">{addReport ? "Soumettre un rapport" : "Modifier le rapport"}</h3>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Titre du document</label>
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold focus:border-emerald-500" value={addReport ? formValues.title : editReport.title} onChange={(e) => addReport ? setFormValues({...formValues, title: e.target.value}) : setEditReport({...editReport, title: e.target.value})} />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Encadrant (Superviseur)</label>
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold focus:border-emerald-500" value={addReport ? formValues.supervisor : editReport.supervisor} onChange={(e) => addReport ? setFormValues({...formValues, supervisor: e.target.value}) : setEditReport({...editReport, supervisor: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Niveau</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold cursor-pointer" value={addReport ? formValues.niveau : editReport.niveau} onChange={(e) => addReport ? setFormValues({...formValues, niveau: e.target.value}) : setEditReport({...editReport, niveau: e.target.value})}>
                  <option value="L1">L1</option><option value="L2">L2</option><option value="L3">L3</option><option value="M1">M1</option><option value="M2">M2</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Date de dépôt</label>
                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={addReport ? formValues.date : editReport.date} onChange={(e) => addReport ? setFormValues({...formValues, date: e.target.value}) : setEditReport({...editReport, date: e.target.value})} />
              </div>

              {addReport && (
                <div className="col-span-2 space-y-1.5 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400">Fichier PDF</label>
                  <div className="relative w-full py-8 border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-600 cursor-pointer">
                    <UploadCloud size={24} />
                    <span className="text-[10px] font-black uppercase">{selectedFile ? selectedFile.name : "Choisir le PDF"}</span>
                    <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => { setAddReport(false); setEditReport(null); }} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-xs uppercase tracking-widest">Annuler</button>
              {isSubmitting && uploadProgress > 0 && (
                  <div className="col-span-2 space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-emerald-600">Téléchargement en cours...</span>
                      <span className="text-[10px] font-black text-emerald-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              <button 
                onClick={addReport ? handleAddReport : handleEditSave} 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Confirmer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION */}
      {deleteReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setDeleteReport(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
              <Trash2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">Supprimer ?</h3>
            <p className="text-slate-500 text-sm mb-10 italic">"{deleteReport.title}"</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeleteReport(null)} className="py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-xs uppercase">Non</button>
              <button onClick={handleDelete} className="py-4 bg-rose-600 text-white font-black rounded-2xl text-xs uppercase shadow-lg shadow-rose-200">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}