import { useState, useEffect } from "react"
import { Search, FileText, BookOpen, GraduationCap, X, Menu, RotateCcw, ArrowRight, Download, Filter } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

interface DocumentItem {
  id: number;
  title: string;
  niveau: string;
  filiere: string;
  classe: string;
  langue: string;
  encadrant: string;
  type: string;
  author: string;
  tel: string;
}

const documentsData: DocumentItem[] = [
  { id: 1, title: "Rapport de stage Academique", niveau: "Licence 3", filiere: "GL", classe: "GL3A", langue: "Français", encadrant: "encadrant 1", type: "Rapport de stage", author: "Alice", tel: "673720992" },
  { id: 2, title: "Projet de classe", niveau: "Licence 2", filiere: "SR", classe: "L2F", langue: "Français", encadrant: "encadrant 2", type: "Rapport de projet", author: "Bob", tel: "673720992" },
  { id: 3, title: "Course of Information Technology", niveau: "Licence 2", filiere: "SE", classe: "BA1A", langue: "Anglais", encadrant: "encadrant 3", type: "Cours", author: "Charles", tel: "673720992" },
]

export default function Catalogue() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const [filters, setFilters] = useState({
    niveau: "", filiere: "", classe: "", langue: "", encadrant: "", type: "", author: ""
  })
  
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>(documentsData)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let docs = [...documentsData]
    if (searchTerm) {
      docs = docs.filter((doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    docs = docs.filter(doc => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return doc[key as keyof DocumentItem] === value;
      });
    });
    setFilteredDocs(docs)
  }, [searchTerm, filters])

  const handleDashboardRedirect = () => {
    if (!user) { navigate("/login"); return; }
    const role = user.role?.toLowerCase()
    if (role === "admin") navigate("/dashboard/admin")
    else if (role === "delegate") navigate("/dashboard/delegate")
    else navigate("/dashboard/student")
  }

  const getDocStyle = (type: string) => {
    switch (type) {
      case "Cours": return { icon: <BookOpen size={32} />, bg: "bg-blue-600/10 text-blue-600" }
      case "Rapport de projet": return { icon: <GraduationCap size={32} />, bg: "bg-purple-600/10 text-purple-600" }
      default: return { icon: <FileText size={32} />, bg: "bg-emerald-600/10 text-emerald-600" }
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-slate-100" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
               <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">ACADEMIX</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Accueil</Link>
            <Link to="/catalogue" className="text-sm font-bold text-emerald-600">Catalogue</Link>
            <button onClick={handleDashboardRedirect} className="group relative px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all hover:pr-10 active:scale-95">
              <span className="relative z-10">{user ? "Mon Dashboard" : "Connexion"}</span>
              <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative pt-32 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Filter size={12} /> Bibliothèque Numérique
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 leading-[1.1] mb-4">Catalogue <span className="text-green-700">Digital</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">Recherchez et filtrez les ressources académiques archivées.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Filtres */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              />
            </div>
            <button 
              onClick={() => {setFilters({niveau: "", filiere: "", classe: "", langue: "", encadrant: "", type: "", author: ""}); setSearchTerm("")}}
              className="flex items-center justify-center gap-2 px-6 py-4 text-slate-500 hover:text-emerald-600 font-bold transition-all"
            >
              <RotateCcw size={18} /> Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "niveau", options: ["Licence 1", "Licence 2", "Licence 3"], label: "Niveau" },
              { name: "filiere", options: ["GL", "SR", "SE", "SN"], label: "Filière" },
              { name: "classe", options: ["L2F", "SR3C", "GL3A", "BA1A"], label: "Classe" },
              { name: "encadrant", options: ["encadrant 1", "encadrant 2", "encadrant 3"], label: "Encadrant" },
              { name: "langue", options: ["Français", "Anglais"], label: "Langue" },
              { name: "type", options: ["Cours", "Rapport de projet", "Rapport de stage"], label: "Type" },
            ].map((f) => (
              <select
                key={f.name}
                name={f.name}
                value={filters[f.name as keyof typeof filters]}
                onChange={(e) => setFilters({...filters, [f.name]: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              >
                <option value="">{f.label}</option>
                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Liste avec TOUTES les informations respectées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const style = getDocStyle(doc.type);
              return (
                <div key={doc.id} className="group bg-white rounded-[40px] border border-slate-100 p-8 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform ${style.bg}`}>
                    {style.icon}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-950 mb-6 leading-snug">{doc.title}</h3>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 border-t border-slate-50 pt-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Auteur</p>
                      <p className="text-sm font-bold text-slate-700">{doc.author}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                      <p className="text-sm font-bold text-slate-700">{doc.tel}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encadrant</p>
                      <p className="text-sm font-bold text-slate-700">{doc.encadrant}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Classe</p>
                      <p className="text-sm font-bold text-slate-700">{doc.classe}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Filière</p>
                      <p className="text-sm font-bold text-slate-700">{doc.filiere}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Niveau</p>
                      <p className="text-sm font-bold text-slate-700">{doc.niveau}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 space-y-3">
                    <div className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg">
                      {doc.type} | {doc.langue}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg">
                      <Download size={18} /> Télécharger
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[40px] border border-dashed border-slate-200 text-center">
               <p className="text-slate-500 font-bold">Aucun document trouvé.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}