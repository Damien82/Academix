import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("https://academix-i3qb.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || "Identifiants invalides" }
      }

      // On stocke tout ici pour centraliser
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)

      return { success: true, role: data.role }
    } catch (error) {
      return { success: false, message: "Le serveur ne répond pas" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.clear() // Plus propre pour tout vider
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)