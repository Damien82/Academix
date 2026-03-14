const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middlewares/auth');

router.get('/', auth, admin, userController.getAllUsers);

router.patch('/:id/status', auth, admin, userController.updateStatus);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;