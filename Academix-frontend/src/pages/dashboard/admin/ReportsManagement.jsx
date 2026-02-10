import { useState } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { Eye, Trash2, Edit, X } from "lucide-react"

export default function ReportsManagement() {
  // 🔹 Données simulées
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Rapport de stage",
      student: "Alice Dupont",
      filiere: "GL",
      classe: "GL3B",
      niveau: "L3",
      langue: "Français",
      tel: "673730091",
      date: "2024-06-12",
    },
    {
      id: 2,
      title: "Projet Réseau",
      student: "Bob Martin",
      filiere: "SR",
      classe: "L2F",
      niveau: "L2",
      langue: "Anglais",
      tel: "673730092",
      date: "2024-06-15",
    },
  ])

  const [search, setSearch] = useState("")
  const [editReport, setEditReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)

  // 🔹 Filtrage
  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.filiere.toLowerCase().includes(search.toLowerCase()) ||
      r.classe.toLowerCase().includes(search.toLowerCase()) ||
      r.niveau.toLowerCase().includes(search.toLowerCase()) ||
      r.langue.toLowerCase().includes(search.toLowerCase()) ||
      r.tel.includes(search)
  )

  // 🔹 Modifier rapport
  const handleUpdate = () => {
    setReports(
      reports.map((r) =>
        r.id === editReport.id ? editReport : r
      )
    )
    setEditReport(null)
  }

  // 🔹 Supprimer rapport
  const handleDelete = () => {
    setReports(reports.filter((r) => r.id !== deleteReport.id))
    setDeleteReport(null)
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Gestion des rapports
            </h2>

            <input
              type="text"
              placeholder="Rechercher..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Rapport</th>
                  <th className="px-6 py-3 text-left text-gray-600">Étudiant</th>
                  <th className="px-6 py-3 text-left text-gray-600">Filière</th>
                  <th className="px-6 py-3 text-left text-gray-600">Classe</th>
                  <th className="px-6 py-3 text-left text-gray-600">Niveau</th>
                  <th className="px-6 py-3 text-left text-gray-600">Langue</th>
                  <th className="px-6 py-3 text-left text-gray-600">Tel</th>
                  <th className="px-6 py-3 text-left text-gray-600">Date</th>
                  <th className="px-6 py-3 text-center text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{report.title}</td>
                    <td className="px-6 py-4">{report.student}</td>
                    <td className="px-6 py-4">{report.filiere}</td>
                    <td className="px-6 py-4">{report.classe}</td>
                    <td className="px-6 py-4">{report.niveau}</td>
                    <td className="px-6 py-4">{report.langue}</td>
                    <td className="px-6 py-4">{report.tel}</td>
                    <td className="px-6 py-4">{report.date}</td>

                    <td className="px-6 py-4 flex justify-center gap-4">
                      <button
                        className="text-blue-700 bg-blue-300 rounded p-2 hover:bg-blue-500"
                        title="Voir"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => setEditReport({ ...report })}
                        className="text-yellow-700 bg-yellow-300 rounded p-2 hover:bg-yellow-500"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => setDeleteReport(report)}
                        className="text-red-700 bg-red-300 rounded p-2 hover:bg-red-500"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                      Aucun rapport trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 🔵 MODAL MODIFICATION */}
      {editReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Modifier le rapport</h3>
              <button onClick={() => setEditReport(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Nom du rapport"
                value={editReport.title}
                onChange={(e) =>
                  setEditReport({ ...editReport, title: e.target.value })
                }
              />

              <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Téléphone"
                value={editReport.tel}
                onChange={(e) =>
                  setEditReport({ ...editReport, tel: e.target.value })
                }
              />

              <select
                className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={editReport.langue}
                onChange={(e) =>
                    setEditReport({ ...editReport, langue: e.target.value })
                }
              >
                <option value="">-- Sélectionner la langue --</option>
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
              </select>


              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditReport(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 MODAL SUPPRESSION */}
      {deleteReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
            <h3 className="text-lg font-bold text-red-600 mb-3">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Supprimer le rapport <br />
              <span className="font-semibold">
                {deleteReport.title}
              </span> ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteReport(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
