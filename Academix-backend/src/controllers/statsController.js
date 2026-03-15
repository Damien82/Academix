const Course = require("../models/Course");
const Report = require("../models/Report");
const User = require("../models/User");

exports.getAdminStats = async (req, res) => {
  try {
    // 1. Récupération des filtres depuis la requête (avec valeurs par défaut)
    const { start, end, metric = "flux" } = req.query;
    
    const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = end ? new Date(end) : new Date();

    // 2. Détermination du modèle et du champ de date selon la métrique choisie
    let targetModel;
    let dateField = "createdAt";

    switch (metric) {
      case "courses": targetModel = Course; break;
      case "reports": targetModel = Report; break;
      case "students": 
        targetModel = User; 
        // On pourrait filtrer ici uniquement les étudiants si besoin
        break;
      default: // "flux" -> Activité utilisateur basée sur les connexions
        targetModel = User;
        dateField = "lastLogin";
    }

    // 3. Exécution des calculs globaux et de l'agrégation temporelle en parallèle
    const [
      totalUsers,
      activeUsersCount,
      totalStudents,
      totalDelegates,
      totalCourses,
      totalReports,
      courseDistribution,
      timeSeriesData
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "delegate" }),
      Course.countDocuments(),
      Report.countDocuments(),
      Course.aggregate([{ $group: { _id: "$filiere", count: { $sum: 1 } } }]),
      
      // Agrégation pour le graphique (Flux temporel)
      targetModel.aggregate([
        {
          $match: {
            [dateField]: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%d %b", date: `$${dateField}` } },
            count: { $sum: 1 },
            fullDate: { $first: `$${dateField}` }
          }
        },
        { $sort: { fullDate: 1 } }
      ])
    ]);

    // 4. Formatage des données pour le graphique Recharts
    const recentActivity = timeSeriesData.map(item => ({
      name: item._id, // Exemple: "15 Mar"
      value: item.count
    }));

    // 5. Calculs des indicateurs de performance
    const activityRate = totalUsers > 0 ? ((activeUsersCount / totalUsers) * 100).toFixed(1) : 0;

    const formattedDistribution = courseDistribution.map(item => ({
      label: item._id || "Autre",
      value: totalCourses > 0 ? Math.round((item.count / totalCourses) * 100) : 0
    }));

    // 6. Envoi de la réponse structurée
    res.status(200).json({
      success: true,
      stats: {
        students: totalStudents,
        delegates: totalDelegates,
        courses: totalCourses,
        reports: totalReports,
        distribution: formattedDistribution,
        activityRate: activityRate, // On envoie un nombre, le front gère le %
        recentActivity // Les données pour le graphique
      }
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la génération des statistiques" });
  }
};
exports.getDelegateStats = async (req, res) => {
  try {
    const [
      mesRapportsSoumis,  
      totalRapportsPlateforme, 
      totalCoursPlateforme, 
      mesCoursSoumis       
    ] = await Promise.all([
      Report.countDocuments({ studentId: req.user.id }),
      Report.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ uploadedById: req.user.id })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        rapports: mesRapportsSoumis,            
        rapportsdisponible: totalRapportsPlateforme, 
        cours: totalCoursPlateforme,          
        courssoumis: mesCoursSoumis,             
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const [
      mesRapportsSoumis,  
      totalRapportsPlateforme, 
      totalCoursPlateforme,      
    ] = await Promise.all([
      Report.countDocuments({ studentId: req.user.id }),
      Report.countDocuments(),
      Course.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        rapports: mesRapportsSoumis,            
        rapportsdisponible: totalRapportsPlateforme, 
        cours: totalCoursPlateforme,                     
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};