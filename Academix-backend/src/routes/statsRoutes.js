const express = require('express');
const router = express.Router();
const { getAdminStats,getDelegateStats,getStudentStats } = require('../controllers/statsController');
const { auth, admin, delegate } = require('../middlewares/auth'); 

router.get('/overview', auth, admin, getAdminStats);
router.get('/delegate', auth, delegate, getDelegateStats);
router.get('/student', auth, getStudentStats);


module.exports = router;