import { useState, useEffect } from "react"
import axios from "axios"
import EleveSidebar from "../../../components/dashboard/EleveSidebar"
import EleveTopbar from "../../../components/dashboard/EleveTopbar"
import { 
  FileText, Edit, Trash2, X, Plus, Eye, 
  Search, Calendar, UserCheck, UploadCloud, Loader2, AlertCircle, CheckCircle2, ChevronDown
} from "lucide-react"

// --- CONSTANTES DE CONFIGURATION ---
const LISTE_FILIERES = ["GL", "SRIT", "DATA", "RSI", "AGE"]
const LISTE_NIVEAUX = ["L1", "L2", "L3", "M1", "M2"]
const LISTE_CLASSES = ["Classe A", "Classe B", "Classe C"]

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

  // Formulaire (Valeurs par défaut)
  const defaultForm = { 
    title: "", student: "", supervisor: "", classe: "", 
    filiere: "GL", niveau: "L3", date: new Date().toISOString().split('T')[0], 
    language: "Français", tel: "673730091" 
  }
  const [formValues, setFormValues] = useState(defaultForm)
  const [selectedFile, setSelectedFile] = useState(null)

  const API_URL = "https://academix-i3qb.onrender.com/api/reports"
  const token = localStorage.getItem('token')

  // --- LOGIQUE DE GESTION ---

  const showStatus = (type, msg) => {
    setStatus({ type, msg })
    setTimeout(() => setStatus({ type: "", msg: "" }), 4000)
  }

  const resetForm = () => {
    setFormValues(defaultForm)
    setSelectedFile(null)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  // Synchronisation du formulaire pour l'édition
  useEffect(() => {
    if (editReport) {
      setFormValues({
        title: editReport.title || "",
        student: editReport.student || "",
        supervisor: editReport.supervisor || "",
        filiere: editReport.filiere || "GL",
        niveau: editReport.niveau || "L3",
        classe: editReport.classe || "",
        language: editReport.language || "Français",
        tel: editReport.tel || "673730091",
        date: editReport.date || ""
      })
    } else {
      resetForm()
    }
  }, [editReport])

  // --- ACTIONS API ---

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
    if (!formValues.title || !selectedFile) return showStatus("error", "Titre et PDF obligatoires")
    if (selectedFile.size > 10 * 1024 * 1024) return showStatus("error", "Fichier trop lourd (max 10Mo)")

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      Object.keys(formValues).forEach(key => formData.append(key, formValues[key]))
      formData.append("file", selectedFile)

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total))
      })

      if (res.data.success) {
        setReports([res.data.report, ...reports])
        setAddReport(false)
        showStatus("success", "Rapport soumis avec succès")
      }
    } catch (err) {
      showStatus("error", err.response?.data?.message || "Échec de l'envoi")
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleEditSave = async () => {
    try {
      setIsSubmitting(true)
      const res = await axios.patch(`${API_URL}/${editReport._id}`, formValues, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.map(r => r._id === editReport._id ? res.data.report : r))
      setEditReport(null)
      showStatus("success", "Mise à jour réussie")
    } catch (err) {
      showStatus("error", "Erreur de modification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await axios.delete(`${API_URL}/${deleteReport._id}`, { headers: { Authorization: `Bearer ${token}` } })
      setReports(reports.filter(r => r._id !== deleteReport._id))
      setDeleteReport(null)
      showStatus("success", "Rapport supprimé")
    } catch (err) {
      showStatus("error", "Action impossible")
    } finally {
      setIsSubmitting(false)
    }
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
            {/* HEADER */}
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

            {/* TABLEAU */}
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
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => { setAddReport(false); setEditReport(null); }} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg flex flex-col max-h-[90vh] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 overflow-hidden">
            
            <div className="p-8 pb-4">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {addReport ? "Nouveau Rapport" : "Modifier Rapport"}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-0 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Titre du rapport</label>
                  <input type="text" name="title" value={formValues.title} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Étudiant</label>
                  <input type="text" name="student" value={formValues.student} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                  <input type="text" name="tel" value={formValues.tel} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800" />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Encadrant (Superviseur)</label>
                  <input type="text" name="supervisor" value={formValues.supervisor} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Filière</label>
                  <select name="filiere" value={formValues.filiere} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    {LISTE_FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Niveau</label>
                  <select name="niveau" value={formValues.niveau} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    {LISTE_NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="col-span-2 space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Classe</label>
                  <select name="classe" value={formValues.classe} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    <option value="">Sélectionner une classe</option>
                    {LISTE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Langue</label>
                  <select name="language" value={formValues.language} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 appearance-none cursor-pointer">
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                  </select>
                </div>

                {addReport && (
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Document (PDF)</label>
                    <div className="relative w-full py-8 px-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[24px] flex flex-col items-center justify-center gap-2 text-emerald-600 font-bold cursor-pointer hover:bg-emerald-100 transition-all">
                      <UploadCloud size={32} />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-center">
                        {selectedFile ? selectedFile.name : "Sélectionner le fichier PDF"}
                      </span>
                      <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                )}

                {isSubmitting && uploadProgress > 0 && (
                  <div className="col-span-2 space-y-2 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-emerald-600">Upload en cours...</span>
                      <span className="text-[10px] font-black text-emerald-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
              <button onClick={() => { setAddReport(false); setEditReport(null); }} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
              <button 
                onClick={addReport ? handleAddReport : handleEditSave} 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Envoi...</> : "Confirmer"}
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
              <button onClick={handleDelete} disabled={isSubmitting} className="py-4 bg-rose-600 text-white font-black rounded-2xl text-xs uppercase shadow-lg shadow-rose-200 disabled:opacity-50">
                {isSubmitting ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}