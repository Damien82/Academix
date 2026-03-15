const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, admin } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

// Tout le monde (connecté) peut voir les cours
router.get('/', auth, courseController.getCourses);

router.get('/mine', auth, courseController.getMyCourses);
const isDelegateOrAdmin = (req, res, next) => {
  if (req.user.role === 'delegate' || req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Accès refusé. Réservé aux délégués." });
  }
};

// Seul l'admin peut ajouter ou supprimer des cours
router.post('/', auth, isDelegateOrAdmin, upload.single('file'), courseController.createCourse);
router.delete('/:id', auth, isDelegateOrAdmin, courseController.deleteCourse);

// Route de modification
router.patch('/:id', auth, isDelegateOrAdmin, courseController.updateCourse);

module.exports = router;