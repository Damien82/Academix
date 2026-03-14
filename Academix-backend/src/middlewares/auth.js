const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Accès refusé." });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
    if (user.status === 'blocked') return res.status(403).json({ success: false, message: "Compte suspendu." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expirée." });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
  }
};

const delegate = (req, res, next) => {
  if (req.user && req.user.role === 'delegate') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
  }
};

const canUploadCourse = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'delegate')) {
    next();
  } else {
    res.status(403).json({ message: "Seul le délégué ou l'admin peut ajouter des cours." });
  }
};

// On exporte tout proprement en une seule fois
module.exports = { auth, admin, canUploadCourse,delegate };