import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { X, Menu } from "lucide-react"
import heroimg from '../../assets/images/Academix.png'
import { Users, FileText, Book } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="font-sans">
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
            <a
              href="#home"
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </a>
            <Link
              to="/catalogue"
              className="text-gray-700 hover:bg-emerald-600 p-2 rounded hover:shadow-md font-semibold rounded"
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

      {/* Hero Section */}
      <section
        id="home"
        className="pt-28 bg-gradient-to-r from-emerald-50 to-white min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 gap-12"
      >
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            Gérez vos rapports, cours et utilisateurs facilement
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Academix est votre plateforme complète pour la gestion des cours, des rapports et des utilisateurs. Accédez à votre dashboard selon votre rôle et optimisez votre workflow.
          </p>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-md"
          >
            Accéder au Dashboard
          </Link>
        </div>

        <div className="flex-1 flex justify-center md:mb-5">
          <img src={heroimg} alt="Logo" className="max-w-sm sm:max-w-lg  rounded-xl shadow-lg"/>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white px-6" id="about">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Fonctionnalités clés</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Découvrez pourquoi Academix est l’outil idéal pour gérer vos activités efficacement.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center gap-4">
            <FileText className="text-emerald-600" size={48} />
            <h3 className="text-xl font-semibold text-gray-800">Gestion des rapports</h3>
            <p className="text-gray-600 text-center">
              Créez, consultez et suivez tous vos rapports rapidement et facilement.
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center gap-4">
            <Book className="text-emerald-600" size={48} />
            <h3 className="text-xl font-semibold text-gray-800">Cours et formations</h3>
            <p className="text-gray-600 text-center">
              Accédez à vos cours et suivez vos progrès directement depuis votre dashboard.
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center gap-4">
            <Users className="text-emerald-600" size={48} />
            <h3 className="text-xl font-semibold text-gray-800">Gestion des utilisateurs</h3>
            <p className="text-gray-600 text-center">
              Ajoutez, modifiez et suivez les utilisateurs avec un contrôle total selon le rôle.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 mt-12 shadow-inner text-center text-gray-500">
        &copy; {new Date().getFullYear()} Academix. Tous droits réservés.
      </footer>
    </div>
  )
}
