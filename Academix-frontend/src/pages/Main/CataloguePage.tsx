// src/pages/Catalogue.tsx
import { useState, useEffect } from "react"
import { Search, FileText, BookOpen, GraduationCap, X, Menu, RotateCcw } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

// 1. Interface pour corriger les erreurs TypeScript
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

// Exemple de données statiques
const documentsData: DocumentItem[] = [
  {
    id: 1,
    title: "Rapport de stage Academique",
    niveau: "Licence 3",
    filiere: "GL",
    classe: "GL3A",
    langue: "Français",
    encadrant: "encadrant 1",
    type: "Rapport de stage",
    author: "Alice",
    tel: "673720992"
  },
  {
    id: 2,
    title: "Projet de classe",
    niveau: "Licence 2",
    filiere: "SR",
    classe: "L2F",
    langue: "Français",
    encadrant: "encadrant 2",
    type: "Rapport de projet",
    author: "Bob",
    tel: "673720992"
  },
  {
    id: 3,
    title: "Course of Information Technology and Management",
    niveau: "Licence 2",
    filiere: "SE",
    classe: "BA1A",
    langue: "Anglais",
    encadrant: "encadrant 3",
    type: "Cours",
    author: "Charles",
    tel: "673720992"
  },
]

export default function Catalogue() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // État initial des filtres
  const [filters, setFilters] = useState({
    niveau: "",
    filiere: "",
    classe: "",
    langue: "",
    encadrant: "",
    type: "",
    author: "",
  })
  
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>(documentsData)

  useEffect(() => {
    let docs = [...documentsData]

    // Recherche par titre
    if (searchTerm) {
      docs = docs.filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Application des filtres (Correction de la logique de boucle)
    docs = docs.filter(doc => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // On ignore le filtre s'il est vide
        return doc[key as keyof DocumentItem] === value;
      });
    });

    setFilteredDocs(docs)
  }, [searchTerm, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  // Fonction pour réinitialiser les filtres (Optionnel mais recommandé)
  const resetFilters = () => {
    setFilters({
      niveau: "", filiere: "", classe: "", langue: "", encadrant: "", type: "", author: ""
    });
    setSearchTerm("");
  }

  const getDocStyle = (type: string) => {
    switch (type) {
      case "Cours":
        return {
          icon: <BookOpen size={40} className="text-white" />,
          bg: "from-blue-500 to-blue-700",
        }
      case "Rapport de projet":
        return {
          icon: <GraduationCap size={40} className="text-white" />,
          bg: "from-purple-500 to-purple-700",
        }
      case "Rapport de stage":
        return {
          icon: <FileText size={40} className="text-white" />,
          bg: "from-emerald-500 to-emerald-700",
        }
      default:
        return {
          icon: <FileText size={40} className="text-white" />,
          bg: "from-gray-500 to-gray-700",
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-emerald-600">Academix</div>

          {/* Desktop Links */}
          <div className="hidden sm:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 font-semibold">Accueil</Link>
            <Link to="/" className="text-gray-700 hover:text-emerald-600 font-semibold">À propos</Link>
            <Link to="/catalogue" className="text-emerald-600 font-bold">Catalogue</Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
            >
              Dashboard
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="sm:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden fixed top-16 left-0 w-full bg-white shadow-md z-40 flex flex-col items-center py-6 gap-4 transition-all border-t">
            <Link to="/" className="font-semibold" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/catalogue" className="font-semibold" onClick={() => setMobileMenuOpen(false)}>Catalogue</Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="bg-emerald-600 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-1 mt-5">Catalogue des documents</h1>
        <p className="text-lg md:text-xl">Recherchez et filtrez les documents selon vos besoins</p>
      </header>

      {/* Recherche + filtres */}
      <main className="max-w-7xl mx-auto p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button onClick={resetFilters} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 text-sm font-medium px-2">
               <RotateCcw size={16} /> Réinitialiser
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select name="niveau" value={filters.niveau} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Niveau</option>
              <option value="Licence 1">Licence 1</option>
              <option value="Licence 2">Licence 2</option>
              <option value="Licence 3">Licence 3</option>
            </select>

            <select name="filiere" value={filters.filiere} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Filière</option>
              <option value="GL">GL</option>
              <option value="SR">SR</option>
              <option value="SE">SE</option>
              <option value="SN">SN</option>
            </select>

            <select name="classe" value={filters.classe} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Classe</option>
              <option value="L2F">L2F</option>
              <option value="SR3C">SR3C</option>
              <option value="GL3A">GL3A</option>
              <option value="BA1A">BA1A</option>
            </select>

            <select name="encadrant" value={filters.encadrant} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Encadrant</option>
              <option value="encadrant 1">encadrant 1</option>
              <option value="encadrant 2">encadrant 2</option>
              <option value="encadrant 3">encadrant 3</option>
            </select>

            <select name="langue" value={filters.langue} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Langue</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
            </select>

            <select name="type" value={filters.type} onChange={handleFilterChange} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Type de document</option>
              <option value="Cours">Cours</option>
              <option value="Rapport de projet">Rapport de projet</option>
              <option value="Rapport de stage">Rapport de stage</option>
            </select>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden flex flex-col border border-gray-100"
              >
                <div className={`h-36 bg-gradient-to-r ${getDocStyle(doc.type).bg} flex items-center justify-center`}>
                  {getDocStyle(doc.type).icon}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{doc.title}</h3>

                  <div className="space-y-1 mb-4">
                    <p className="text-gray-600 text-sm"><strong>Auteur:</strong> {doc.author}</p>
                    <p className="text-gray-600 text-sm"><strong>Niveau:</strong> {doc.niveau}</p>
                    <p className="text-gray-600 text-sm"><strong>Filière:</strong> {doc.filiere}</p>
                    <p className="text-gray-600 text-sm"><strong>Classe:</strong> {doc.classe}</p>
                    <p className="text-gray-600 text-sm"><strong>Encadrant:</strong> {doc.encadrant}</p>
                    <p className="text-gray-600 text-sm"><strong>Tel:</strong> {doc.tel}</p>
                    <p className="text-gray-600 text-sm"><strong>Langue:</strong> {doc.langue}</p>
                  </div>

                  <span className="inline-block mb-4 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit">
                    {doc.type}
                  </span>

                  <button className="mt-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold">
                    Télécharger le document
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              Aucun document ne correspond à vos critères de recherche.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}