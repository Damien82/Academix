import { useState, useEffect, useRef } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import { 
  Users, FileText, BookOpen, TrendingUp, UserCheck, Loader2, Download, AlertCircle, CheckCircle2 
} from "lucide-react"
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [modal, setModal] = useState({ show: false, message: "", type: "info" })
  const dashboardRef = useRef(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/api/stats/overview", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data.stats)
      } catch (err) {
        showAlert("Impossible de récupérer les statistiques.", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const showAlert = (message, type = "info") => {
    setModal({ show: true, message, type })
  }

  // ✅ GÉNÉRATION SIMPLIFIÉE : Directe via jsPDF (Plus de html2canvas = Plus de bug oklch)
  const handleExportPDF = async () => {
    if (!stats) return
    setExporting(true)
    
    try {
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const dateStr = new Date().toLocaleDateString('fr-FR');

      // Style de l'en-tête (Slate-900)
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ACADEMIX - RAPPORT ADMIN", 20, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Édité le : ${dateStr}`, 160, 25);

      // Section Stats
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.text("Indicateurs Clés", 20, 55);

      const items = [
        ["Étudiants", stats.students],
        ["Délégués", stats.delegates],
        ["Cours", stats.courses],
        ["Rapports", stats.reports],
        ["Taux d'activité", `${stats.activityRate}%`]
      ];

      let yPos = 70;
      items.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${label} :`, 25, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(String(value || 0), 80, yPos);
        doc.setDrawColor(226, 232, 240);
        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 15;
      });

      // Section Filières
      if (stats.distribution) {
        yPos += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Répartition par filière", 20, yPos);
        yPos += 15;

        stats.distribution.forEach((item) => {
          doc.setFontSize(11);
          doc.text(item.label, 25, yPos);
          doc.text(`${item.value}%`, 175, yPos);
          
          // Barre de progression (Couleurs simples)
          doc.setFillColor(241, 245, 249);
          doc.rect(25, yPos + 2, 160, 2, "F");
          doc.setFillColor(16, 185, 129); 
          doc.rect(25, yPos + 2, (item.value * 160) / 100, 2, "F");
          yPos += 12;
        });
      }

      doc.save(`Rapport_Admin_${new Date().toISOString().split('T')[0]}.pdf`);
      showAlert("Le rapport a été généré avec succès (Format vectoriel).", "success");
      
    } catch (error) {
      console.error("Erreur PDF:", error);
      showAlert("Erreur lors de la création du PDF.", "error");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    )
  }

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden relative">
      <AdminSidebar />

      {modal.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modal.type === "error" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
                {modal.type === "error" ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{modal.type === "error" ? "Oups !" : "Succès"}</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{modal.message}</p>
              <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95">Continuer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto space-y-10 p-4">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vue d’ensemble</h2>
                <p className="text-slate-500 font-medium mt-1">Données réelles synchronisées avec MongoDB.</p>
              </div>
              <button 
                onClick={handleExportPDF}
                disabled={exporting}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {exporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                {exporting ? "Génération..." : "Exporter les données"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <StatCard title="Étudiants" value={stats?.students} icon={<Users size={22} />} color="blue" />
              <StatCard title="Délégués" value={stats?.delegates} icon={<UserCheck size={22} />} color="emerald" />
              <StatCard title="Cours" value={stats?.courses} icon={<BookOpen size={22} />} color="purple" />
              <StatCard title="Rapports" value={stats?.reports} icon={<FileText size={22} />} color="blue" />
              <StatCard title="Activité" value={stats?.activityRate} icon={<TrendingUp size={22} />} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
              <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
                <h3 className="text-xl font-black text-slate-800 mb-8">Activité récente</h3>
                <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[24px] bg-slate-50/50">
                   <p className="text-slate-500 font-bold text-sm">Graphique des flux</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-8">Cours par filière</h3>
                  <div className="space-y-6">
                    {stats?.distribution?.map((item, idx) => (
                      <FiliereProgress key={idx} label={item.label} value={item.value} color={idx % 2 === 0 ? "bg-emerald-500" : "bg-blue-400"} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
  }
  return (
    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  )
}

function FiliereProgress({ label, value, color }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[13px] font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}