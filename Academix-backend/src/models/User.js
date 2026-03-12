const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  classe: { type: String, required: true },
  filiere: { type: String, required: true },
  niveau: { type: String, required: true },
  section: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'delegate'], default: 'student' }
}, { timestamps: true }); // Ajoute automatiquement createdAt et updatedAt

module.exports = mongoose.model('User', UserSchema);