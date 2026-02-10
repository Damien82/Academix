import {
  Users,
  FileText,
  BookOpen,
  TrendingUp
} from "lucide-react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"

export default function AdminDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-8 space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Vue d’ensemble
            </h2>
            <p className="text-gray-500 text-sm">
              Statistiques générales de la plateforme
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Étudiants"
              value="1 284"
              icon={<Users />}
            />
            <StatCard
              title="Rapports"
              value="342"
              icon={<FileText />}
            />
            <StatCard
              title="Cours"
              value="56"
              icon={<BookOpen />}
            />
            <StatCard
              title="Activité"
              value="+18%"
              icon={<TrendingUp />}
            />
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">
                Activité récente
              </h3>
              <p className="text-gray-500 text-sm">
                Données simulées (backend à venir)
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">
                Répartition par filière
              </h3>
              <p className="text-gray-500 text-sm">
                Graphiques plus tard 📊
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* 🔹 Stat Card Component */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
