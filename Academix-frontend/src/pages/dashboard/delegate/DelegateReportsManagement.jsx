import { useState } from "react"
import DelegueSidebar from "../../../components/dashboard/DelegateSidebar"
import AdminTopbar from "../../../components/dashboard/DelegateTopbar"
import { FileText, Edit, Trash2, X, Plus, Eye } from "lucide-react"

export default function DelegueReports() {
  const [reports, setReports] = useState([
    { id: 1, title: "Rapport de stage", classe: "GL3A", filiere: "GL", date: "2024-06-12", language: "Français",tel:"673730091" },
    { id: 2, title: "Projet Réseau", classe: "SR3C", filiere: "SR", date: "2024-06-15", language: "Anglais",tel:"673730091"  },
    { id: 3, title: "Mémoire de licence", classe: "GL3B", filiere: "GL", date: "2024-06-20", language: "Français",tel:"673730091"  },
  ])

  const [search, setSearch] = useState("")
  const [editReport, setEditReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)
  const [addReport, setAddReport] = useState(false)
  const [formValues, setFormValues] = useState({ title: "", classe: "", filiere: "", date: "", language: "Français" })

  const filteredReports = reports.filter(
    r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.classe.toLowerCase().includes(search.toLowerCase()) ||
      r.filiere.toLowerCase().includes(search.toLowerCase()) ||
      r.tel.toLowerCase().includes(search.toLowerCase()) 
  )

  // 🔹 Handlers
  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleAddReport = () => {
    if (!formValues.title || !formValues.classe || !formValues.filiere || !formValues.date) {
      alert("Veuillez remplir tous les champs.")
      return
    }
    setReports([...reports, { id: Date.now(), ...formValues }])
    setAddReport(false)
    setFormValues({ title: "", classe: "", filiere: "", date: "", language: "Français" })
  }

  const handleEditOpen = (report) => {
    setEditReport(report)
    setFormValues({ ...report })
  }

  const handleEditSave = () => {
    setReports(
      reports.map(r => r.id === editReport.id ? { ...r, ...formValues } : r)
    )
    setEditReport(null)
  }

  const handleDelete = () => {
    setReports(reports.filter(r => r.id !== deleteReport.id))
    setDeleteReport(null)
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DelegueSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des rapports</h2>
            <button
              onClick={() => setAddReport(true)}
              className="px-4 py-2 flex items-center gap-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus size={18} /> Ajouter un rapport
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Rechercher..."
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">Titre</th>
                    <th className="px-6 py-3 text-left text-gray-600">Classe</th>
                    <th className="px-6 py-3 text-left text-gray-600">Filière</th>
                    <th className="px-6 py-3 text-left text-gray-600">Langue</th>
                    <th className="px-6 py-3 text-left text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left text-gray-600">Tel</th>
                    <th className="px-6 py-3 text-center text-gray-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <FileText className="text-emerald-600" size={18} />
                        {report.title}
                      </td>
                      <td className="px-6 py-4">{report.classe}</td>
                      <td className="px-6 py-4">{report.filiere}</td>
                      <td className="px-6 py-4">{report.language}</td>
                      <td className="px-6 py-4">{report.date}</td>
                      <td className="px-6 py-4">{report.tel}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditOpen(report)}
                          className="text-blue-700 bg-blue-300 rounded p-2 hover:bg-blue-500"
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
                        <button className="text-green-700 bg-green-300 rounded p-2 hover:bg-green-500" title="Voir">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                        Aucun rapport trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* 🔹 MODAL AJOUT */}
        {addReport && (
          <ModalReport
            title="Ajouter un rapport"
            values={formValues}
            setValues={setFormValues}
            onClose={() => setAddReport(false)}
            onSave={handleAddReport}
          />
        )}

        {/* 🔹 MODAL MODIFICATION */}
        {editReport && (
          <ModalReport
            title="Modifier le rapport"
            values={formValues}
            setValues={setFormValues}
            onClose={() => setEditReport(null)}
            onSave={handleEditSave}
          />
        )}

        {/* 🔹 MODAL SUPPRESSION */}
        {deleteReport && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
              <div className="flex justify-end">
                <button onClick={() => setDeleteReport(null)}><X /></button>
              </div>
              <h3 className="text-lg font-bold text-red-600 mb-3">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Supprimer le rapport <br />
                <span className="font-semibold">{deleteReport.title}</span> ?
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setDeleteReport(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 🔹 Composant Modal réutilisable pour Ajouter / Modifier
function ModalReport({ title, values, setValues, onClose, onSave }) {
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}><X size={20} /></button>
        <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Nom du projet"
            value={values.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            name="classe"
            placeholder="Classe"
            value={values.classe}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            name="filiere"
            placeholder="Filière"
            value={values.filiere}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            name="language"
            value={values.language}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Français">Français</option>
            <option value="Anglais">Anglais</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
          <button onClick={onSave} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
