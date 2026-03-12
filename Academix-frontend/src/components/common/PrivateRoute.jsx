import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth() // On récupère 'loading' du contexte

  // 1. INDISPENSABLE : On attend que le contexte ait fini de vérifier le localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  // 2. Si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. Si l'utilisateur est connecté mais n'a pas le bon rôle
  if (role && user.role !== role) {
    // Plutôt que de le jeter au login, on le renvoie vers son propre dashboard
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }

  // 4. Tout est bon, on affiche la page
  return children
}