import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext" 

export default function Login() {
  const { login } = useAuth() 
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // On utilise UNIQUEMENT la fonction login du contexte
      const res = await login(email, password)

      if (res.success) {
        // La redirection se fait ici avec le rôle renvoyé par le contexte
        navigate(`/dashboard/${res.role}`)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        <div className="bg-emerald-600 p-8 text-center text-white">
          <h1 className="text-4xl font-black tracking-tight">Academix</h1>
          <p className="text-emerald-100 mt-2 font-medium">Heureux de vous revoir !</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-600 mb-1 block ml-1">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex justify-between items-end mb-1 ml-1">
                <label className="text-xs font-semibold text-gray-600">Mot de passe</label>
                <button type="button" className="text-[10px] text-emerald-600 font-bold hover:underline">Oublié ?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
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
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
            ) : (
              <>
                <LogIn size={20} />
                Se connecter
              </>
            )}
          </button>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}