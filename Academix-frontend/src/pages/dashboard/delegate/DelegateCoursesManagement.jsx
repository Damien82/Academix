import { useState, useEffect } from "react"
import axios from "axios"
import DelegateSidebar from "../../../components/dashboard/DelegateSidebar"
import DelegateTopbar from "../../../components/dashboard/DelegateTopbar"
import { 
  FileText, Trash2, Eye, X, Edit, Search, 
  Plus, Globe, UploadCloud, CheckCircle2, AlertCircle, Loader2, Phone, ChevronDown, Calendar
} from "lucide-react"

export default function DelegueCourses() {
  // --- ÉTATS ---
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editCourse, setEditCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)
  const [addCourse, setAddCourse] = useState(false)
  const [status, setStatus] = useState({ type: "", msg: "" })

  const LISTE_FILIERES = ["Génie Logiciel", "Systèmes & Réseaux", "Sécurité Informatique", "Data Science", "Management des SI"];
  const LISTE_NIVEAUX = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];
  const LISTE_CLASSES = ["Groupe A", "Groupe B", "Soir", "Alternance", "Initial"];

  const [formValues, setFormValues] = useState({ 
    title: "", 
    language: "Français",
    uploadedBy: "", 
    tel: "", 
    filiere: LISTE_FILIERES[0], 
    niveau: LISTE_NIVEAUX[0],    
    classe: LISTE_CLASSES[0]    
  })
  const [selectedFile, setSelectedFile] = useState(null)

  const API_URL = "https://academix-i3qb.onrender.com/api/courses"
  const token = localStorage.getItem('token')

  // --- LOGIQUE API ---
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data.success) setCourses(res.data.courses)
    } catch (err) {
      showStatus("error", "Erreur de connexion.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const showStatus = (type, msg) => {
    setStatus({ type, msg })
    setTimeout(() => setStatus({ type: "", msg: "" }), 4000)
  }

  const handleFormChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  const handleAddCourse = async () => {
    if (!selectedFile || !formValues.title || !formValues.uploadedBy) {
      return showStatus("error", "Titre, Auteur et Fichier sont obligatoires.")
    }
    const formData = new FormData()
    Object.keys(formValues).forEach(key => formData.append(key, formValues[key]))
    formData.append("file", selectedFile)

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      setCourses([res.data.course, ...courses])
      setAddCourse(false)
      resetForm()
      showStatus("success", "Cours publié avec succès.")
    } catch (err) {
      showStatus("error", "Échec de l'upload.")
    }
  }

  const handleEditSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/${editCourse._id}`, 
        formValues, 
        { headers: { Authorization: `Bearer ${token}` }}
      )
      setCourses(courses.map(c => c._id === editCourse._id ? res.data.course : c))
      setEditCourse(null)
      resetForm()
      showStatus("success", "Mise à jour effectuée.")
    } catch (err) {
      showStatus("error", "Erreur de modification.")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteCourse._id}`, { headers: { Authorization: `Bearer ${token}` } })
      setCourses(courses.filter(c => c._id !== deleteCourse._id))
      setDeleteCourse(null)
      showStatus("success", "Supprimé avec succès.")
    } catch (err) {
      showStatus("error", "Action impossible.")
    }
  }

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      link.setAttribute('download', safeName); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showStatus("error", "Erreur lors du téléchargement.");
    }
  };

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date().toDateString();
    const reportDate = new Date(dateStr).toDateString();
    return today === reportDate;
  }

  const resetForm = () => {
    setFormValues({ 
        title: "", language: "Français", uploadedBy: "", tel: "", 
        filiere: LISTE_FILIERES[0], niveau: LISTE_NIVEAUX[0], classe: LISTE_CLASSES[0] 
    })
    setSelectedFile(null)
  }

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(search.toLowerCase()) || 
    c.uploadedBy?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans">
      <DelegateSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DelegateTopbar />
        <main className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          
          {status.msg && (
            <div className={`fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${status.type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-rose-600 border-rose-400 text-white"}`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{status.msg}</span>
            </div>
          )}

          <div className="max-w-full mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">Gestion des cours</h2>
                <p className="text-slate-500 font-medium mt-1 text-sm">Organisez les supports par filière et niveau.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." className="pl-11 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl w-full md:w-80 text-sm focus:outline-none focus:border-emerald-500 transition-all font-semibold" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { resetForm(); setAddCourse(true); }} className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <Plus size={18} strokeWidth={3} /> Ajouter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Document</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Auteur</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Cursus</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Date de Publication</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-emerald-600" /></td></tr>
                    ) : filteredCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center"><FileText size={22} /></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-[15px]">{course.title}</span>
                                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Globe size={10}/> {course.language}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col text-sm font-bold text-slate-800">
                            {course.uploadedBy}
                            <span className="text-[11px] text-emerald-600/70 font-bold flex items-center gap-1"><Phone size={10} /> {course.tel}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase">{course.niveau}</span>
                            <span className="text-sm font-bold text-slate-700">{course.filiere}</span>
                            <span className="text-[11px] text-slate-400 font-bold italic">({course.classe})</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                              <Calendar size={14} className="text-slate-400" />
                              {course.createdAt ? new Date(course.createdAt).toLocaleDateString('fr-FR') : "Date inconnue"}
                            </div>
                            {isToday(course.createdAt) && (
                              <span className="w-fit px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">Récent</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-2.5">
                            <button onClick={() => { setEditCourse(course); setFormValues(course); }} className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all"><Edit size={18} /></button>
                            <button onClick={() => setDeleteCourse(course)} className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={18} /></button>
                            <button onClick={() => handleDownload(course.fileUrl, course.title)} className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all" title="Télécharger"><Eye size={18} /></button>
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

      {/* --- MODAL AVEC SCROLL INTERNE --- */}
      {(addCourse || editCourse) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => { setAddCourse(false); setEditCourse(null); }} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg flex flex-col max-h-[90vh] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 pb-4">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {addCourse ? "Publication de Cours" : "Édition du Document"}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-0 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Titre du document</label>
                  <input type="text" name="title" value={formValues.title} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Auteur</label>
                  <input type="text" name="uploadedBy" value={formValues.uploadedBy} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                  <input type="text" name="tel" value={formValues.tel} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Filière</label>
                  <select name="filiere" value={formValues.filiere} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    {LISTE_FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-10 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Niveau</label>
                  <select name="niveau" value={formValues.niveau} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    {LISTE_NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-10 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="col-span-2 space-y-1.5 relative">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Classe</label>
                  <select name="classe" value={formValues.classe} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    {LISTE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-10 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Langue</label>
                  <select name="language" value={formValues.language} onChange={handleFormChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer">
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                  </select>
                </div>

                {addCourse && (
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Fichier du cours</label>
                    <div className="relative w-full py-8 px-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-600 font-bold cursor-pointer hover:bg-emerald-100 transition-all">
                      <UploadCloud size={32} />
                      <span className="text-[10px] uppercase tracking-tighter text-center">
                        {selectedFile ? selectedFile.name : "Sélectionner un PDF ou Image"}
                      </span>
                      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button onClick={() => { setAddCourse(false); setEditCourse(null); }} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Annuler</button>
              <button onClick={addCourse ? handleAddCourse : handleEditSave} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                {addCourse ? "Confirmer la publication" : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION */}
      {deleteCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setDeleteCourse(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[24px] flex items-center justify-center mx-auto mb-6"><Trash2 size={36} /></div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">Supprimer ?</h3>
            <p className="text-slate-500 text-sm mb-8 italic">"{deleteCourse.title}" sera retiré de la base.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeleteCourse(null)} className="py-4 bg-slate-100 text-slate-600 font-black rounded-2xl text-[10px] uppercase">Annuler</button>
              <button onClick={handleDelete} className="py-4 bg-rose-600 text-white font-black rounded-2xl text-[10px] uppercase">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}