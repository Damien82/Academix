import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle,Loader2 } from "lucide-react" // Ajout de AlertCircle
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext" 

export default function Login() {
  const { login } = useAuth() 
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Si on arrive ici via une redirection de PrivateRoute (ex: compte bloqué)
    if (location.state?.error) {
      setError(location.state.error)
      // On nettoie l'état de navigation pour éviter que le message reste au refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        navigate(`/dashboard/${res.role}`)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError("Connexion impossible. Vérifiez votre accès internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 transition-all">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-center text-white relative">
          <h1 className="text-4xl font-black tracking-tight">Academix</h1>
          <p className="text-emerald-100 mt-2 font-medium">Portail d'authentification</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          
          {/* Alerte Dynamique */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email académique</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="nom@ecole.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mot de passe</label>
                <button type="button" className="text-xs text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Oublié ?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Accéder au Dashboard
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 font-medium">
              Nouveau sur la plateforme ?{" "}
              <Link to="/register" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}