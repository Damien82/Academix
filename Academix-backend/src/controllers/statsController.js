const Course = require("../models/Course");
const Report = require("../models/Report");
const User = require("../models/User");

exports.getAdminStats = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsersCount,
      totalStudents,
      totalDelegates,
      totalCourses,
      totalReports,
      courseDistribution
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: twentyFourHoursAgo } }),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "delegate" }),
      Course.countDocuments(),
      Report.countDocuments(),
      Course.aggregate([{ $group: { _id: "$filiere", count: { $sum: 1 } } }])
    ]);

    const activityRate = totalUsers > 0 ? ((activeUsersCount / totalUsers) * 100).toFixed(1) : 0;

    const formattedDistribution = courseDistribution.map(item => ({
      label: item._id || "Inconnu",
      value: totalCourses > 0 ? Math.round((item.count / totalCourses) * 100) : 0
    }));

    res.status(200).json({
      success: true,
      stats: {
        students: totalStudents.toLocaleString(),
        delegates: totalDelegates.toLocaleString(),
        courses: totalCourses,
        reports: totalReports,
        distribution: formattedDistribution,
        activityRate: `${activityRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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