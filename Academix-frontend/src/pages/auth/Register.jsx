import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  GraduationCap,
  Layers,
  BarChart3,
  Grid
} from "lucide-react"

import { useState } from "react"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-10">
      <form className="bg-white w-[420px] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-emerald-600 mb-2">
          Academix
        </h1>
        <h1 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          Inscription
        </h1>

        {/* Nom */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            placeholder="Nom et prénom"
            className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Téléphone */}
        <div className="mb-4 relative">
          <Phone className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Classe */}
        <div className="mb-4 relative">
          <GraduationCap className="absolute left-3 top-4 text-gray-400" size={18} />
          
          <select className="w-full pl-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Classe</option>
            <option>L1F</option>
            <option>L2F</option>
            <option>GL3A</option>
            <option>SRC</option>
          </select>
        </div>

        {/* Filière */}
        <div className="mb-4 relative">
            <Layers className="absolute left-3 top-4 text-gray-400" size={18} />
            <select className="w-full pl-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">            <option>Filière</option>
            <option>Systèmes Et Réseaux</option>
            <option>Génie Logiciel</option>
          </select>
        </div>

        {/* Niveau */}
        <div className="mb-4 relative">
            <BarChart3 className="absolute left-3 top-4 text-gray-400" size={18} />
            <select className="w-full pl-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">            <option>Niveau académique</option>
            <option>Niveau 1</option>
            <option>Niveau 2</option>
            <option>Niveau 3</option>
          </select>
        </div>

        {/* Section */}
        <div className="mb-4 relative">
            <Grid className="absolute left-3 top-4 text-gray-400" size={18} />
            <select className="w-full pl-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">            <option>Section</option>
            <option>Francophone</option>
            <option>Anglophone</option>
          </select>
        </div>

        {/* Mot de passe */}
        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Bouton */}
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-lg font-semibold">
          S’inscrire
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Vous avez déjà un compte ?{" "}
          <a href="/" className="text-emerald-600 font-semibold">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  )
}
