import { useState } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { Edit, Trash2 } from "lucide-react"

export default function UsersManagement() {
  // 🔹 Données simulées
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@academix.com",  filiere: "GL", niveau: "L3", tel:"673730091", classe:"GL3B", role: "delegue"},
    { id: 2, name: "Bob Martin", email: "bob@academix.com", filiere: "SR", niveau: "L2",tel:"673730092", classe:"L2F", role: "delegue"}
  ])

  const [search, setSearch] = useState("")

  // 🔹 Filtrage
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.filiere.toLowerCase().includes(search.toLowerCase()) ||
      u.niveau.toLowerCase().includes(search.toLowerCase()) ||
      u.tel.toLowerCase().includes(search.toLowerCase()) ||
      u.classe.toLowerCase().includes(search.toLowerCase())
  )

  // 🔹 Supprimer utilisateur (simulé)
  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
            <input
              type="text"
              placeholder="Rechercher..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Nom</th>
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Filière</th>
                  <th className="px-6 py-3 text-left text-gray-600">Classe</th>
                  <th className="px-6 py-3 text-left text-gray-600">Niveau</th>
                  <th className="px-6 py-3 text-left text-gray-600">Tel</th>
                  <th className="px-6 py-3 text-left text-gray-600">Role</th>
                  <th className="px-6 py-3 text-center text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.filiere}</td>
                    <td className="px-6 py-4">{user.classe}</td>
                    <td className="px-6 py-4">{user.niveau}</td>
                    <td className="px-6 py-4">{user.tel}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4 flex justify-center gap-4">
                      <button
                        className="text-red-700 bg-red-300 rounded p-2 hover:bg-red-500"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
