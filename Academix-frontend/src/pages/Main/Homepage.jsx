import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { X, Menu, Users, FileText, Book, ArrowRight, ChevronRight, GraduationCap } from "lucide-react"
import heroimg from '../../assets/images/Academix.png'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Gestion de l'effet de scroll sur la navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Logique de redirection selon le rôle
  const handleDashboardRedirect = () => {
    if (!user) {
      navigate("/login")
      return
    }

    const role = user.role?.toLowerCase()
    switch (role) {
      case "admin":
        navigate("/dashboard/admin")
        break
      case "delegate":
        navigate("/dashboard/delegate")
        break
      case "student":
        navigate("/dashboard/student")
        break
      default:
        navigate("/dashboard")
    }
  }

  return (
    <div className="bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- NAVBAR MODERNE --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-slate-100" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
               <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">ACADEMIX</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              <a href="#home" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Accueil</a>
              <a href="#about" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">À propos</a>
              <Link to="/catalogue" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Catalogue</Link>
            </div>
            
            {/* Bouton Dashboard Dynamique */}
            <button
              onClick={handleDashboardRedirect}
              className="group relative px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl overflow-hidden transition-all hover:pr-10 active:scale-95"
            >
              <span className="relative z-10">{user ? "Mon Dashboard" : "Connexion"}</span>
              <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={16} />
            </button>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-32 lg:pt-48 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-emerald-50/50 rounded-l-[100px] hidden lg:block" />
        <div className="absolute top-20 left-10 -z-10 w-64 h-64 bg-emerald-200/20 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[12px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              Plateforme Académique 2.0
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-slate-950 leading-[1.1] tracking-tight">
              Centralisez votre <span className="text-emerald-600">savoir</span> académique.
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
              La solution complète pour la gestion des rapports de stage, ressources pédagogiques et suivi étudiant. Simplicité, sécurité et efficacité.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {/* Bouton Dashboard Dynamique Hero */}
              <button 
                onClick={handleDashboardRedirect}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 text-center"
              >
                {user ? "Accéder à mon espace" : "Démarrer maintenant"}
              </button>
              <Link to="/catalogue" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all text-center">
                Voir le catalogue
              </Link>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 p-4 bg-white rounded-[40px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-1000">
              <img src={heroimg} alt="Interface Academix" className="rounded-[32px] w-full" />
            </div>
            <div className="absolute -bottom-6 -left-6 z-20 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl hidden md:block border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black">2.5k+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Documents partagés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-slate-50 px-6" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em]">Fonctionnalités</h2>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">Conçu pour l'excellence académique.</h3>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">
              Une infrastructure robuste pour répondre aux besoins des étudiants, enseignants et administrateurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Gestion de rapports", desc: "Centralisation sécurisée des mémoires et projets de fin d'études avec archivage intelligent.", color: "bg-blue-500" },
              { icon: Book, title: "Cours & Ressources", desc: "Accès instantané aux supports de cours par filière, niveau et spécialité académique.", color: "bg-emerald-500" },
              { icon: Users, title: "Contrôle d'accès", desc: "Système de rôles granulaire assurant la confidentialité et l'intégrité des données.", color: "bg-slate-900" }
            ].map((feature, i) => (
              <div key={i} className="group p-10 bg-white rounded-[32px] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-950 mb-4">{feature.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-sm font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  En savoir plus <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                   <GraduationCap className="text-white" size={18} />
                </div>
                <span className="text-xl font-black tracking-tighter">ACADEMIX</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm">
                Simplifier l'accès à la connaissance et optimiser la gestion administrative des établissements d'enseignement supérieur.
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-950 mb-6">Plateforme</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link to="/catalogue" className="hover:text-emerald-600 transition-colors">Catalogue</Link></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Cours</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Rapports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-950 mb-6">Support</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Aide</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Sécurité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Omniflex. Built for excellence.
            </p>
            <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <a href="#" className="hover:text-slate-900 transition-colors">Confidentialité</a>
               <a href="#" className="hover:text-slate-900 transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-6 flex flex-col animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black tracking-tighter">ACADEMIX</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-8 text-center">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900">Accueil</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900">À propos</a>
            <Link to="/catalogue" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900">Catalogue</Link>
            
            {/* Bouton Dashboard Mobile Dynamique */}
            <button 
              onClick={() => { setMobileMenuOpen(false); handleDashboardRedirect(); }} 
              className="mt-4 px-8 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl text-2xl active:scale-95"
            >
              {user ? "Dashboard" : "Connexion"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}