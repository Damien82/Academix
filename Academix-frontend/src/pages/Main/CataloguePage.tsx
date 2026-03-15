import { useState, useEffect, useCallback, useMemo } from "react"
import { 
  Search, FileText, BookOpen, GraduationCap, RotateCcw, 
  ArrowRight, Download, Hash, Loader2, AlertCircle, ChevronRight, X, Menu, Calendar, Phone 
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

interface DocumentItem {
  id: number;
  title: string;
  niveau: string;
  filiere: string;
  classe: string;
  langue: string;
  encadrant?: string;
  type: string;
  author: string;
  tel: string;
  fileUrl?: string;
  publishedAt?: string;
  _sourceRoute?: string;
}

export default function Catalogue() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("") 

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [reportsRes, coursesRes] = await Promise.all([
        axios.get("https://academix-i3qb.onrender.com/api/reports", config),
        axios.get("https://academix-i3qb.onrender.com/api/courses", config)
      ])

      const reportsData = reportsRes.data.reports || []
      const coursesData = coursesRes.data.courses || []

      const combinedData = [
        ...reportsData.map((d: any) => ({ 
          ...d, 
          _sourceRoute: 'reports',
          author: d.student || "Non spécifié",
          encadrant: d.supervisor || d.encadrant || "Non spécifié",
          type: "Rapport de projet",
          niveau: d.niveau || "N/A",
          filiere: d.filiere || "N/A",
          classe: d.classe || "N/A",
          langue: d.langue || "Français",
          tel: d.tel || "",
          publishedAt: d.createdAt || d.publishedAt
        })),
        ...coursesData.map((d: any) => ({ 
          ...d, 
          _sourceRoute: 'courses',
          author: d.uploadedBy || d.author || "Enseignant",
          type: "Cours",
          niveau: d.niveau || "N/A",
          filiere: d.filiere || "N/A",
          classe: d.classe || "N/A",
          langue: d.langue || "Français",
          tel: d.tel || "",
          publishedAt: d.createdAt || d.publishedAt
        }))
      ]

      setAllDocuments(combinedData)
    } catch (err: any) {
      setError(err.response?.status === 401 ? "Session expirée." : "Erreur de synchronisation.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDocuments() }, [fetchDocuments])

  const filteredDocuments = useMemo(() => {
    let result = [...allDocuments]
    if (searchTerm.trim() !== "") {
      const s = searchTerm.toLowerCase()
      result = result.filter(doc => 
        doc.title?.toLowerCase().includes(s) ||
        doc.author?.toLowerCase().includes(s) ||
        doc.filiere?.toLowerCase().includes(s) ||
        doc.classe?.toLowerCase().includes(s) ||
        doc.encadrant?.toLowerCase().includes(s) ||
        doc.type?.toLowerCase().includes(s)
      )
    }
    if (selectedDate !== "") {
      result = result.filter(doc => {
        if (!doc.publishedAt) return false
        return new Date(doc.publishedAt).toISOString().split('T')[0] === selectedDate
      })
    }
    return result.sort((a, b) => a.title.localeCompare(b.title))
  }, [searchTerm, selectedDate, allDocuments])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDashboardRedirect = () => {
    if (!user) { navigate("/login"); return; }
    const role = user.role?.toLowerCase()
    navigate(role === "admin" ? "/dashboard/admin" : role === "delegate" ? "/dashboard/delegate" : "/dashboard/student")
  }

const handleDownload = async (doc: DocumentItem) => {
  try {
    // On utilise directement l'URL du fichier présente dans l'objet
    const fileUrl = doc.fileUrl;
    
    if (!fileUrl) {
      alert("L'URL du fichier est manquante pour ce document.");
      return;
    }

    const response = await fetch(fileUrl);
    
    if (!response.ok) throw new Error("Erreur lors de la récupération du fichier");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // On force le nom avec le titre et l'extension .pdf
    const fileName = doc.title;
    const safeName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    
    link.setAttribute('download', safeName);
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur de téléchargement:", error);
    alert("Erreur lors du téléchargement du document.");
  }
};

  const getDocStyle = (type: string) => {
    switch (type) {
      case "Cours": return { icon: <BookOpen size={28} />, bg: "bg-blue-50 text-blue-600 border-blue-100" }
      case "Rapport de projet": return { icon: <GraduationCap size={28} />, bg: "bg-purple-50 text-purple-600 border-purple-100" }
      default: return { icon: <FileText size={28} />, bg: "bg-emerald-50 text-emerald-600 border-emerald-100" }
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans selection:bg-emerald-100">
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-slate-100" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
               <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">ACADEMIX</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              <Link to="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Accueil</Link>
              <Link to="/catalogue" className="text-sm font-bold text-emerald-600 transition-colors">Catalogue</Link>
            </div>
            <button onClick={handleDashboardRedirect} className="group relative px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl overflow-hidden transition-all hover:pr-10 active:scale-95">
              <span className="relative z-10">{user ? "Mon Dashboard" : "Connexion"}</span>
              <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={16} />
            </button>
          </div>
          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <header className="relative pt-44 pb-20 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <Hash size={12} /> {filteredDocuments.length} Documents Indexés
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 leading-none mb-6">
            Savoir <span className="text-emerald-600">Digital.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg leading-relaxed">
            Accédez instantanément à la base de données académique : cours magistraux, rapports de stage et projets tutorés.
          </p>
        </div>
      </header>

      {/* FILTRES & GRID */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, classe, filière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>
            <div className="relative group min-w-[220px]">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:bg-white outline-none font-bold text-slate-700 cursor-pointer"
              />
            </div>
            <button onClick={() => {setSearchTerm(""); setSelectedDate("")}}
              className="flex items-center justify-center gap-3 px-8 py-5 text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-rose-50 rounded-[24px]">
              <RotateCcw size={18} /> Réinitialiser
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="text-emerald-500 animate-spin mb-6" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Synchronisation...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDocuments.map((doc) => {
              const style = getDocStyle(doc.type);
              const formattedDate = doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric'
              }) : "Date inconnue";

              return (
                <div key={`${doc._sourceRoute}-${doc.id}`} className="group bg-white rounded-[48px] border border-slate-100 p-10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Publié le</span>
                      <span className="text-xs font-bold text-slate-500">{formattedDate}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-8 leading-tight group-hover:text-emerald-600 transition-colors h-16 overflow-hidden line-clamp-2">
                    {doc.title}
                  </h3>

                  <div className="space-y-5 mb-10 border-t border-slate-50 pt-8">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auteur</span>
                      <span className="text-sm font-black text-slate-700">{doc.author}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classe / Filière</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-slate-500">{doc.classe}</span>
                         <div className="w-1 h-1 bg-emerald-300 rounded-full" />
                         <span className="text-xs font-black text-emerald-600">{doc.filiere}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau</span>
                      <span className="text-xs font-bold text-slate-600">{doc.niveau}</span>
                    </div>

                    {doc.type === "Rapport de projet" && doc.encadrant && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encadrant</span>
                        <span className="text-xs font-bold text-slate-600">{doc.encadrant}</span>
                      </div>
                    )}

                    {doc.tel && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</span>
                        <div className="flex items-center gap-1.5 text-slate-600">
                           <Phone size={12} className="text-emerald-500" />
                           <span className="text-xs font-bold">{doc.tel}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg tracking-tighter">{doc.type}</span>
                       <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg tracking-tighter ${doc.langue === 'Français' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>{doc.langue}</span>
                    </div>
                    <button onClick={() => handleDownload(doc)} className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200 group/btn">
                      <Download size={18} className="group-hover/btn:animate-bounce" /> Télécharger PDF
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><GraduationCap className="text-white" size={18} /></div>
                <span className="text-xl font-black tracking-tighter">ACADEMIX</span>
              </div>
              <p className="text-slate-500 font-medium max-sm">Simplifier l'accès à la connaissance et optimiser la gestion administrative.</p>
            </div>
            <div>
              <h5 className="font-black text-slate-950 mb-6 uppercase text-[10px] tracking-widest">Plateforme</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link to="/catalogue" className="hover:text-emerald-600 transition-colors">Catalogue</Link></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Cours</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Rapports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-950 mb-6 uppercase text-[10px] tracking-widest">Support</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Aide</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Omniflex. Built for excellence.</p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-slate-900 transition-colors">Confidentialité</a>
               <a href="#" className="hover:text-slate-900 transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-6 flex flex-col animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black tracking-tighter">ACADEMIX</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-8 text-center">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900">Accueil</Link>
            <Link to="/catalogue" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900">Catalogue</Link>
            <button onClick={() => { setMobileMenuOpen(false); handleDashboardRedirect(); }} className="mt-4 px-8 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl text-2xl active:scale-95">
              {user ? "Dashboard" : "Connexion"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}