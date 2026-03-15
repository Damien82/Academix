import { useState, useEffect, useRef } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import { 
  Users, FileText, BookOpen, TrendingUp, UserCheck, Loader2, Download, AlertCircle, CheckCircle2, Calendar
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminSidebar from "../../../components/dashboard/AdminSidebar"
import AdminTopbar from "../../../components/dashboard/AdminTopbar"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [modal, setModal] = useState({ show: false, message: "", type: "info" })
  
  // Nouveaux états pour les filtres du graphique
  const [chartMetric, setChartMetric] = useState("flux") 
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // J-7 par défaut
    end: new Date().toISOString().split('T')[0]
  })

  // Fonction de récupération des données avec filtres
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("https://academix-i3qb.onrender.com/api/stats/overview", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...dateRange, metric: chartMetric } // Envoi des filtres au backend
      })
      setStats(res.data.stats)
    } catch (err) {
      showAlert("Erreur lors de la mise à jour des données.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [dateRange, chartMetric]) // Recharger si un filtre change

  const showAlert = (message, type = "info") => {
    setModal({ show: true, message, type })
  }

  const handleExportPDF = async () => {
    if (!stats) return
    setExporting(true)
    try {
      const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const dateStr = new Date().toLocaleDateString('fr-FR');
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ACADEMIX - RAPPORT ADMIN", 20, 25);
      doc.setFontSize(10);
      doc.text(`Édité le : ${dateStr}`, 160, 25);
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

      doc.save(`Rapport_Admin_${new Date().toISOString().split('T')[0]}.pdf`);
      showAlert("Le rapport a été généré avec succès.", "success");
    } catch (error) {
      showAlert("Erreur lors de la création du PDF.", "error");
    } finally {
      setExporting(false);
    }
  }

  if (loading && !stats) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    )
  }

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden relative font-sans">
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
                <p className="text-slate-500 font-medium mt-1">Données analytiques MongoDB en temps réel.</p>
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
                
                {/* --- HEADER DU GRAPHIQUE AVEC FILTRES --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h3 className="text-xl font-black text-slate-800">Activité récente</h3>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Sélecteur de Type de Données */}
                    <select 
                      value={chartMetric}
                      onChange={(e) => setChartMetric(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="flux">Activité</option>
                      <option value="reports">Rapports</option>
                      <option value="courses">Cours</option>
                      <option value="students">Étudiants</option>
                    </select>

                    {/* Sélecteur de Calendrier */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                      <Calendar size={14} className="text-slate-400 ml-1" />
                      <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="bg-transparent border-none text-[10px] font-bold text-slate-600 outline-none"
                      />
                      <span className="text-slate-300">-</span>
                      <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="bg-transparent border-none text-[10px] font-bold text-slate-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.recentActivity || []}>
                      <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" // Le backend devra renvoyer le champ "value" peu importe la métrique
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorActivity)" 
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
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

// Composants StatCard et FiliereProgress restent identiques à votre version précédente
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