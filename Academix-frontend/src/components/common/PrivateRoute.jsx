import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function PrivateRoute({ children, role }) {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  // 1. Attente du chargement initial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  // 2. CAS : UTILISATEUR BLOQUÉ
  // Si le compte est bloqué, on le déconnecte et on le renvoie au login
  if (user && user.status === "blocked") {
    logout() // On nettoie le localStorage
    return <Navigate to="/login" replace state={{ error: "Votre compte est suspendu." }} />
  }

  // 3. CAS : PAS DE SESSION
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 4. CAS : UTILISATEUR RESTREINT (Restriction spécifique au catalogue)
  if (location.pathname === "/catalogue" && user.status === "restricted") {
    // On le renvoie vers son dashboard sans le déconnecter
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }

  // 5. VÉRIFICATION DU RÔLE
  if (role && user.role !== role) {
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }

  // 6. ACCÈS AUTORISÉ
  return children
}