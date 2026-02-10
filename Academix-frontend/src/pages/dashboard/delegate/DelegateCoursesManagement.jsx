import { useState } from "react"
import DelegueSidebar from "../../../components/dashboard/DelegateSidebar"
import AdminTopbar from "../../../components/dashboard/DelegateTopbar"
import { FileText, Edit, Trash2, X, Plus, Eye } from "lucide-react"

export default function DelegueCourses() {
  const [courses, setCourses] = useState([
    { id: 1, title: "Algorithmique avancée", uploadedBy: "Alice Dupont", filiere: "GL", niveau: "L3", classe: "GL3B", language: "Français",tel:"673720992" },
    { id: 2, title: "Réseaux informatiques", uploadedBy: "Bob Martin", filiere: "SR", niveau: "L2", classe: "L2F", language: "Anglais",tel:"673720992" },
    { id: 3, title: "Génie logiciel", uploadedBy: "Admin One", filiere: "SR", niveau: "L3", classe: "SR3C", language: "Français",tel:"673720992" },
  ])

  const [search, setSearch] = useState("")
  const [editCourse, setEditCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)
  const [addCourse, setAddCourse] = useState(false)
  const [formValues, setFormValues] = useState({ title: "", filiere: "", classe: "", niveau: "", uploadedBy: "", language: "Français" })

  const filteredCourses = courses.filter(
    c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.filiere.toLowerCase().includes(search.toLowerCase()) ||
      c.classe.toLowerCase().includes(search.toLowerCase()) ||
      c.niveau.toLowerCase().includes(search.toLowerCase()) ||
      c.tel.toLowerCase().includes(search.toLowerCase())
  )

  // 🔹 Handlers
  const handleFormChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  const handleAddCourse = () => {
    if (!formValues.title || !formValues.filiere || !formValues.classe || !formValues.niveau || !formValues.uploadedBy) {
      alert("Veuillez remplir tous les champs.")
      return
    }
    setCourses([...courses, { id: Date.now(), ...formValues }])
    setAddCourse(false)
    setFormValues({ title: "", filiere: "", classe: "", niveau: "", uploadedBy: "", language: "Français" })
  }

  const handleEditOpen = (course) => {
    setEditCourse(course)
    setFormValues({ ...course })
  }

  const handleEditSave = () => {
    setCourses(
      courses.map(c => c.id === editCourse.id ? { ...c, ...formValues } : c)
    )
    setEditCourse(null)
  }

  const handleDelete = () => {
    setCourses(courses.filter(c => c.id !== deleteCourse.id))
    setDeleteCourse(null)
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DelegueSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des cours</h2>
            <button
              onClick={() => setAddCourse(true)}
              className="px-4 py-2 flex items-center gap-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus size={18} /> Ajouter un cours
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
                    <th className="px-6 py-3 text-left text-gray-600">Cours</th>
                    <th className="px-6 py-3 text-left text-gray-600">Publié par</th>
                    <th className="px-6 py-3 text-left text-gray-600">Filière</th>
                    <th className="px-6 py-3 text-left text-gray-600">Classe</th>
                    <th className="px-6 py-3 text-left text-gray-600">Niveau</th>
                    <th className="px-6 py-3 text-left text-gray-600">Langue</th>
                    <th className="px-6 py-3 text-left text-gray-600">Tel</th>
                    <th className="px-6 py-3 text-center text-gray-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <FileText className="text-emerald-600" size={18} />
                        {course.title}
                      </td>
                      <td className="px-6 py-4">{course.uploadedBy}</td>
                      <td className="px-6 py-4">{course.filiere}</td>
                      <td className="px-6 py-4">{course.classe}</td>
                      <td className="px-6 py-4">{course.niveau}</td>
                      <td className="px-6 py-4">{course.tel}</td>
                      <td className="px-6 py-4">{course.language}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditOpen(course)}
                          className="text-blue-700 bg-blue-300 rounded p-2 hover:bg-blue-500"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteCourse(course)}
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
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                        Aucun cours trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* 🔹 MODAL AJOUT */}
        {addCourse && (
          <ModalCourse
            title="Ajouter un cours"
            values={formValues}
            setValues={setFormValues}
            onClose={() => setAddCourse(false)}
            onSave={handleAddCourse}
          />
        )}

        {/* 🔹 MODAL MODIFICATION */}
        {editCourse && (
          <ModalCourse
            title="Modifier le cours"
            values={formValues}
            setValues={setFormValues}
            onClose={() => setEditCourse(null)}
            onSave={handleEditSave}
          />
        )}

        {/* 🔹 MODAL SUPPRESSION */}
        {deleteCourse && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
              <div className="flex justify-end">
                <button onClick={() => setDeleteCourse(null)}><X /></button>
              </div>
              <h3 className="text-lg font-bold text-red-600 mb-3">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Supprimer le cours <br />
                <span className="font-semibold">{deleteCourse.title}</span> ?
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setDeleteCourse(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
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
function ModalCourse({ title, values, setValues, onClose, onSave }) {
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
            placeholder="Nom du cours"
            value={values.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            name="uploadedBy"
            placeholder="Publié par"
            value={values.uploadedBy}
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
            type="text"
            name="classe"
            placeholder="Classe"
            value={values.classe}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            name="niveau"
            placeholder="Niveau"
            value={values.niveau}
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
