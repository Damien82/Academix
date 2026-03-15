import { useState, useEffect } from "react"
import axios from "axios"
import DelegueSidebar from "../../../components/dashboard/DelegateSidebar"
import AdminTopbar from "../../../components/dashboard/DelegateTopbar"
import { 
  FileText, Edit, Trash2, X, Plus, Search, 
  Phone, Calendar, UploadCloud, UserCheck, Loader2, Download, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react"

export default function DelegueReports() {
  // --- ÉTATS ---
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editReport, setEditReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)
  const [addReport, setAddReport] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: "", msg: "" })

  // --- OPTIONS ---
  const LISTE_FILIERES = ["Génie Logiciel", "Systèmes & Réseaux", "Sécurité Informatique", "Data Science", "Management des SI"];
  const LISTE_NIVEAUX = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];
  const LISTE_CLASSES = ["Groupe A", "Groupe B", "Soir", "Alternance", "Initial"];

  const [formValues, setFormValues] = useState({ 
    title: "", student: "", supervisor: "", 
    classe: LISTE_CLASSES[0], filiere: LISTE_FILIERES[0], niveau: LISTE_NIVEAUX[0], 
    language: "Français", tel: "" 
  })
  const [selectedFile, setSelectedFile] = useState(null)

  const API_URL = "https://academix-i3qb.onrender.com/api/reports"
  const token = localStorage.getItem('token')

  // --- LOGIQUE API ---
  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) setReports(res.data.reports)
    } catch (err) {
      showStatus("error", "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const showStatus = (type, msg) => {
    setStatus({ type, msg })
    setTimeout(() => setStatus({ type: "", msg: "" }), 4000)
  }

  const handleFormChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  const handleAddReport = async () => {
    if (!selectedFile || !formValues.title || !formValues.student) {
      return showStatus("error", "Fichier, titre et étudiant obligatoires.")
    }
    const formData = new FormData()
    Object.keys(formValues).forEach(key => formData.append(key, formValues[key]))
    formData.append("file", selectedFile)

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${token}` 
        }
      })
      if (res.data.success) {
        setReports([res.data.report, ...reports])
        setAddReport(false)
        resetForm()
        showStatus("success", "Rapport publié avec succès.")
      }
    } catch (err) {
      showStatus("error", "Échec de l'ajout.")
    }finally{
    setIsSubmitting(false);
    }
  }

  const handleEditSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/${editReport._id}`, formValues, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(reports.map(r => r._id === editReport._id ? res.data.report : r))
      setEditReport(null)
      resetForm()
      showStatus("success", "Mise à jour réussie.")
    } catch (err) {
      showStatus("error", "Erreur de modification.")
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await axios.delete(`${API_URL}/${deleteReport._id}`, { headers: { Authorization: `Bearer ${token}` } })
      setReports(reports.filter(r => r._id !== deleteReport._id))
      setDeleteReport(null)
      showStatus("success", "Supprimé avec succès.")
    } catch (err) {
      showStatus("error", "Action impossible.")
    }finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const safeName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`
      link.setAttribute('download', safeName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      showStatus("error", "Erreur de téléchargement.")
    }
  }

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date().toDateString();
    const reportDate = new Date(dateStr).toDateString();
    return today === reportDate;
  }

  const resetForm = () => {
    setFormValues({ title: "", student: "", supervisor: "", classe: LISTE_CLASSES[0], filiere: LISTE_FILIERES[0], niveau: LISTE_NIVEAUX[0], language: "Français", tel: "" })
    setSelectedFile(null)
  }

  const filteredReports = reports.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.student?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <DelegueSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
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
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">Gestion des rapports</h2>
                <p className="text-slate-500 font-medium mt-1">Suivi des travaux de fin d'études.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." className="pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl w-full md:w-80 text-sm focus:outline-none focus:border-emerald-500 transition-all font-semibold" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { resetForm(); setAddReport(true); }} className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <Plus size={18} strokeWidth={3} /> Nouveau
                </button>
              </div>
            </div>

            {/* TABLEAU */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">Document / Étudiant</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">Encadrant</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">Cursus</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400">Publication</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-emerald-600" /></td></tr>
                    ) : filteredReports.map(report => (
                      <tr key={report._id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
                              <FileText size={22} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-[15px]">{report.title}</span>
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase">{report.student}</span>
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><Phone size={10} /> {report.tel}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <UserCheck size={20} className="text-emerald-600" />
                            {report.supervisor || "À définir"}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase">{report.niveau}</span>
                            <span className="text-sm font-bold text-slate-700">{report.filiere}</span>
                            <span className="text-[10px] font-bold text-slate-500">{report.classe}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                              <Calendar size={14} className="text-slate-400" />
                              {report.createdAt ? new Date(report.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                            </div>
                            {isToday(report.createdAt) && (
                              <span className="w-fit px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase animate-pulse">Récent</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2.5">
                            <button onClick={() => { setEditReport(report); setFormValues(report); }} className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all"><Edit size={18} /></button>
                            <button onClick={() => setDeleteReport(report)} className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={18} /></button>
                            <button onClick={() => handleDownload(report.fileUrl, report.title)} className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"><Download size={18} /></button>
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

        {/* MODAL AJOUT/MODIF */}
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
                    <input type="text" name="student" value={formValues.student} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                    <input type="text" name="tel" value={formValues.tel} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Encadrant (Superviseur)</label>
                    <input type="text" name="supervisor" value={formValues.supervisor} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-emerald-500" />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Filière</label>
                    <select name="filiere" value={formValues.filiere} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                      {LISTE_FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Niveau</label>
                    <select name="niveau" value={formValues.niveau} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                      {LISTE_NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <div className="col-span-2 space-y-1.5 relative">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Classe</label>
                    <select name="classe" value={formValues.classe} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                      {LISTE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-11 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Langue</label>
                    <select name="language" value={formValues.language} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer">
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                    </select>
                  </div>

                  {addReport && (
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Document du rapport (PDF)</label>
                      <div className="relative w-full py-8 px-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[24px] flex flex-col items-center justify-center gap-2 text-emerald-600 font-bold cursor-pointer hover:bg-emerald-100 transition-all group">
                        <UploadCloud size={32} />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-center">
                          {selectedFile ? selectedFile.name : "Sélectionner le fichier PDF"}
                        </span>
                        <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
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
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi en cours...
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
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setDeleteReport(null)} />
            <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-950">Supprimer ?</h3>
              <p className="text-slate-500 text-sm mb-8">Action irréversible pour le rapport de {deleteReport.student}.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setDeleteReport(null)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs uppercase">Annuler</button>
                <button 
                  onClick={handleDelete} 
                  disabled={isSubmitting}
                  className="py-4 bg-rose-600 text-white font-bold rounded-2xl text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}