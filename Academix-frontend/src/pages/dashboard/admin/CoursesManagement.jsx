import { useState } from "react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"
import { FileText, Trash2, Eye, X, Edit } from "lucide-react"

export default function CoursesManagement() {
  const [courses, setCourses] = useState([
    { id: 1, title: "Algorithmique avancée", uploadedBy: "Alice Dupont", filiere: "GL", niveau: "L3", classe:"GL3B", language: "Français", tel: "673730091" },
    { id: 2, title: "Réseaux informatiques", uploadedBy: "Bob Martin", filiere: "SR", niveau: "L2", classe:"L2F", language: "Anglais", tel: "673730092" },
    { id: 3, title: "Génie logiciel", uploadedBy: "Admin One", filiere: "SR", niveau: "L3", classe:"SR3C", language: "Français", tel: "673730093" },
  ])

  const [search, setSearch] = useState("")
  const [deleteCourse, setDeleteCourse] = useState(null)
  const [editCourse, setEditCourse] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedLanguage, setEditedLanguage] = useState("Français")

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      c.filiere.toLowerCase().includes(search.toLowerCase()) ||
      c.tel.includes(search)
  )

  // 🔹 Supprimer cours
  const handleDelete = () => {
    setCourses(courses.filter((c) => c.id !== deleteCourse.id))
    setDeleteCourse(null)
  }

  // 🔹 Modifier cours
  const handleEditSave = () => {
    setCourses(courses.map((c) =>
      c.id === editCourse.id
        ? { ...c, title: editedTitle, language: editedLanguage }
        : c
    ))
    setEditCourse(null)
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Gestion des cours
            </h2>
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FileText className="text-emerald-500" size={18} />
                      {course.title}
                    </td>
                    <td className="px-6 py-4">{course.uploadedBy}</td>
                    <td className="px-6 py-4">{course.filiere}</td>
                    <td className="px-6 py-4">{course.classe}</td>
                    <td className="px-6 py-4">{course.niveau}</td>
                    <td className="px-6 py-4">{course.language}</td>
                    <td className="px-6 py-4">{course.tel}</td>
                    <td className="px-6 py-4 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setEditCourse(course)
                          setEditedTitle(course.title)
                          setEditedLanguage(course.language)
                        }}
                        className="text-yellow-700 bg-yellow-300 rounded p-2 hover:bg-yellow-500"
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
                      <button className="text-blue-700 bg-blue-300 rounded p-2 hover:bg-blue-500">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
                      Aucun cours trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 🔴 MODAL SUPPRESSION */}
      {deleteCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
            <div className="flex justify-end">
              <button onClick={() => setDeleteCourse(null)}>
                <X />
              </button>
            </div>

            <h3 className="text-lg font-bold text-red-600 mb-3">
              Confirmer la suppression
            </h3>

            <p className="text-gray-600 mb-6">
              Supprimer le cours <br />
              <span className="font-semibold">
                {deleteCourse.title}
              </span> ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteCourse(null)}
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

      {/* 🔵 MODAL MODIFICATION */}
      {editCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Modifier le cours</h3>
              <button onClick={() => setEditCourse(null)}>
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-gray-600">Nom du cours</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <label className="text-gray-600">Langue</label>
              <select
                value={editedLanguage}
                onChange={(e) => setEditedLanguage(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
              </select>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
