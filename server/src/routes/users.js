const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');

// All user routes require authentication
router.patch('/profile', authenticate, usersController.updateProfile);
router.patch('/password', authenticate, usersController.changePassword);
router.get('/statistics', authenticate, usersController.getStatistics);

module.exports = router;
