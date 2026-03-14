const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

// Route accessible par les étudiants pour uploader
router.post('/upload', auth, upload.single('file'), reportController.createReport);

// Routes Administrateur
router.get('/', auth, reportController.getReports);
router.get('/mine', auth, reportController.getMyReports);
router.patch('/:id', auth, reportController.updateReport);
router.delete('/:id', auth, reportController.deleteReport);

module.exports = router;