const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  student: { type: String, required: true }, // Nom de l'étudiant (pour affichage rapide)
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisor: { type: String, required: true },
  filiere: { type: String, required: true },
  classe: { type: String, required: true },
  niveau: { type: String, required: true },
  langue: { type: String, default: 'Français' },
  tel: { type: String },
  date: { type: String, default: () => new Date().toLocaleDateString('fr-FR') },
  fileUrl: { type: String }, // Lien vers le PDF (Cloudinary ou local)
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);