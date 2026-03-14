const Report = require('../models/Report');

// Récupérer tous les rapports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des rapports" });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    // req.user.id vient de ton middleware verifyToken
    const reports = await Report.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// Mettre à jour un rapport (Titre et Encadrant comme dans ton modal)
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, supervisor } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { title, supervisor },
      { new: true }
    );

    if (!updatedReport) return res.status(404).json({ message: "Rapport introuvable" });

    res.status(200).json({ success: true, report: updatedReport });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour" });
  }
};


exports.createReport = async (req, res) => {
  try {
    const { title, supervisor, student, filiere, classe, niveau, tel, langue } = req.body;
    
    // req.file.path contiendra l'URL sécurisée envoyée par Cloudinary
    if (!req.file) {
      return res.status(400).json({ message: "Le fichier PDF est requis." });
    }

    const newReport = new Report({
      title,
      student,
      studentId: req.user.id, // ID de l'étudiant connecté
      supervisor,
      filiere,
      classe,
      niveau,
      tel,
      langue,
      fileUrl: req.file.path, // URL Cloudinary
      publicId: req.file.filename // Utile pour la suppression ultérieure
    });

    await newReport.save();
    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suppression améliorée (Supprime aussi sur Cloudinary)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Rapport introuvable" });

    // Supprimer le fichier sur Cloudinary si un ID existe
    if (report.publicId) {
      const { cloudinary } = require('../config/cloudinary');
      await cloudinary.uploader.destroy(report.publicId, { resource_type: 'raw' });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Rapport et fichier supprimés." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

