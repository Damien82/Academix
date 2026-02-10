import { useState } from "react"
import DelegueSidebar from "../../../components/dashboard/DelegateSidebar"
import AdminTopbar from "../../../components/dashboard/DelegateTopbar"
import { useAuth } from "../../../context/AuthContext"
import { Lock, X, Edit, Check, AlertCircle } from "lucide-react"

export default function DelegueProfile() {
  const { user } = useAuth()

  const [editPassword, setEditPassword] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Le nouveau mot de passe et la confirmation ne correspondent pas.")
      return
    }
    setEditPassword(false)
    setPasswords({ current: "", new: "", confirm: "" })
    setSuccessMessage("Mot de passe mis à jour !")
  }

  const handleProfileUpdate = () => {
    setEditProfile(false)
    setSuccessMessage("Profil mis à jour !")
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DelegueSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Profil Card */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar & Modifier Profil */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full bg-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={() => setEditProfile(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit size={16} /> Modifier le profil
                </button>
              </div>

              {/* Infos & Stats */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-500">{profileData.email}</p>
                <p className="text-gray-400 capitalize">{user?.role}</p>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="bg-emerald-50 px-6 py-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">12</p>
                    <p className="text-gray-500 text-sm">Rapports soumis</p>
                  </div>
                  <div className="bg-emerald-50 px-6 py-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">5</p>
                    <p className="text-gray-500 text-sm">Cours ajoutés</p>
                  </div>
                </div>

                {/* Modifier mot de passe */}
                <button
                  onClick={() => setEditPassword(true)}
                  className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Lock size={18} /> Modifier le mot de passe
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* MODAL MOT DE PASSE */}
        {editPassword && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setEditPassword(false)}
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Modifier le mot de passe</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  name="current"
                  placeholder="Mot de passe actuel"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="password"
                  name="new"
                  placeholder="Nouveau mot de passe"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditPassword(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PROFIL */}
        {editProfile && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setEditProfile(false)}
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Modifier le profil</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditProfile(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 MODAL SUCCESS MESSAGE */}
        {successMessage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[350px] p-6 shadow-lg flex flex-col items-center gap-4">
              <Check className="text-emerald-500" size={40} />
              <p className="text-gray-800 font-medium text-center">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage("")}
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* 🔹 MODAL ERROR MESSAGE */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[350px] p-6 shadow-lg flex flex-col items-center gap-4">
              <AlertCircle className="text-red-500" size={40} />
              <p className="text-gray-800 font-medium text-center">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
