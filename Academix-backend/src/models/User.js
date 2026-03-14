const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  classe: { type: String, required: true },
  filiere: { type: String, required: true },
  niveau: { type: String, required: true },
  section: { type: String, required: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  
  // Gestion des permissions
  role: { 
    type: String, 
    enum: ['student', 'admin', 'delegate'], 
    default: 'student' 
  },
  
  // Gestion de l'état du compte (Nouveau)
  status: { 
    type: String, 
    enum: ['active', 'blocked', 'restricted'], 
    default: 'active' 
  }
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);