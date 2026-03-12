import { User, Mail, Lock, Eye, EyeOff, Phone, GraduationCap, Layers, BarChart3, Grid } from "lucide-react"
import { useState } from "react"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    classe: "",
    filiere: "",
    niveau: "",
    section: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert("Inscription réussie !")
      } else {
        alert(`Erreur : ${data.message}`)
      }
    } catch (error) {
      alert("Impossible de contacter le serveur.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      {/* Conteneur principal plus large pour accommoder les deux colonnes */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header avec dégradé léger */}
        <div className="bg-emerald-600 p-8 text-center text-white">
          <h1 className="text-4xl font-black tracking-tight">Academix</h1>
          <p className="text-emerald-100 mt-2 font-medium">Créez votre compte étudiant en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          
          {/* SECTION : INFORMATIONS PERSONNELLES */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ex: Alice Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="6xx xxx xxx"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION : PARCOURS ACADÉMIQUE */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Parcours Académique</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Classe</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <select 
                    name="classe" 
                    value={formData.classe} 
                    onChange={handleChange} 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="L1F">L1F</option>
                    <option value="L2F">L2F</option>
                    <option value="GL3A">GL3A</option>
                    <option value="SRC">SRC</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Filière</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <select 
                    name="filiere" 
                    value={formData.filiere} 
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Systèmes Et Réseaux">Systèmes Et Réseaux</option>
                    <option value="Génie Logiciel">Génie Logiciel</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Niveau</label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <select 
                    name="niveau" 
                    value={formData.niveau} 
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Niveau 1">Niveau 1</option>
                    <option value="Niveau 2">Niveau 2</option>
                    <option value="Niveau 3">Niveau 3</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Section</label>
                <div className="relative">
                  <Grid className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <select 
                    name="section" 
                    value={formData.section} 
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Francophone">Francophone</option>
                    <option value="Anglophone">Anglophone</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* MOT DE PASSE */}
          <div className="relative">
            <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.98]">
            Créer mon compte
          </button>

          <p className="text-sm text-center text-gray-500 font-medium">
            Déjà inscrit ?{" "}
            <a href="/" className="text-emerald-600 font-bold hover:underline">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  )
}