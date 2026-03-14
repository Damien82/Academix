const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { 
    type: String, 
    required: true,
    enum: ['Français', 'Anglais'], 
    default: 'Français' 
  },

  uploadedById: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  uploadedBy: { type: String, required: true }, // On garde le nom pour un affichage rapide
  tel: { type: String },
  filiere: { type: String, required: true },
  niveau: { type: String, required: true },
  classe: { type: String },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);