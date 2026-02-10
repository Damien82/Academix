import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = login(email, password)

    if (!res.success) {
      setError(res.message)
      return
    }

    navigate(`/dashboard/${res.role}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[380px] rounded-2xl shadow-xl p-8"
      >

        <h1 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          Connexion
        </h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-4 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
          Se connecter
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Pas de compte ?{" "}
          <a href="/register" className="text-emerald-600 font-semibold">
            S’inscrire
          </a>
        </p>
      </form>
    </div>
  )
}
