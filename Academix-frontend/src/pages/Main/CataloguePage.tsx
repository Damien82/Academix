// src/pages/Catalogue.tsx
import { useState, useEffect } from "react"
import { Search, FileText, BookOpen, GraduationCap, X, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

// Exemple de données statiques
const documentsData = [
  {
    id: 1,
    title: "Rapport de stage Academique",
    niveau: "Licence 3",
    filiere: "GL",
    classe: "GL3A",
    langue: "Français",
    type: "Rapport de stage",
    author: "Alice",
    tel:"673720992"
  },
  {
    id: 2,
    title: "Projet de classe",
    niveau: "Licence 2",
    filiere: "SR",
    classe: "L2F",
    langue: "Français",
    type: "Rapport de projet",
    author: "Bob",
    tel:"673720992"
  },
  {
    id: 3,
    title: "Course of Information Technology and Management",
    niveau: "Licence 2",
    filiere: "SE",
    classe: "BA1A",
    langue: "Anglais",
    type: "Cours",
    author: "Charles",
    tel:"673720992"
  },
]

export default function Catalogue() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    niveau: "",
    filiere: "",
    classe: "",
    langue: "",
    type: "",
    author: "",
  })
  const [filteredDocs, setFilteredDocs] = useState(documentsData)

  useEffect(() => {
    let docs = documentsData

    // Recherche par titre
    if (searchTerm) {
      docs = docs.filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Application des filtres
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof typeof filters]
      if (value) {
        docs = docs.filter((doc) => doc[key as keyof typeof filters] === value)
      }
    })

    setFilteredDocs(docs)
  }, [searchTerm, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
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
            <a href="#home" className="text-gray-700 hover:text-emerald-600 font-semibold">Accueil</a>
            <a href="#about" className="text-gray-700 hover:text-emerald-600 font-semibold">À propos</a>
            <Link to="/catalogue" className="text-gray-700 hover:text-emerald-600 font-semibold">Catalogue</Link>
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
          <div className="sm:hidden fixed top-16 left-0 w-full bg-white shadow-md z-40 flex flex-col items-center py-6 gap-4 transition-all">
            <Link
              to="/"
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/" 
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/catalogue"
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
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
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              name="niveau"
              value={filters.niveau}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Niveau</option>
              <option value="Licence 1">Licence 1</option>
              <option value="Licence 2">Licence 2</option>
              <option value="Licence 3">Licence 3</option>
            </select>

            <select
              name="filiere"
              value={filters.filiere}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Filière</option>
              <option value="Informatique">GL</option>
              <option value="Génie Civil">SR</option>
              <option value="Mathématiques">SE</option>
              <option value="Économie">SN</option>
            </select>

            <select
              name="classe"
              value={filters.classe}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Classe</option>
              <option value="L1 Info">L2F</option>
              <option value="L2 Math">SR3C</option>
              <option value="L3 Info">GL3A</option>
              <option value="M2 GC">BA1A</option>
            </select>

            <select
              name="langue"
              value={filters.langue}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Langue</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
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
                    className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
                >
                
                    <div
                        className={`h-36 bg-gradient-to-r ${getDocStyle(doc.type).bg} flex items-center justify-center`}
                    >
                        {getDocStyle(doc.type).icon}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {doc.title}
                        </h3>

                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Auteur:</strong> {doc.author}
                        </p>

                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Niveau:</strong> {doc.niveau}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Filière:</strong> {doc.filiere}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Classe:</strong> {doc.classe}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Tel:</strong> {doc.tel}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            <strong>Langue:</strong> {doc.langue}
                        </p>
                    
                        <span className="inline-block mt-2 mb-4 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit">
                            {doc.type}
                        </span>

                        <button className="mt-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                            Télécharger le document
                        </button>
                    </div>
                </div>

            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Aucun document trouvé.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
