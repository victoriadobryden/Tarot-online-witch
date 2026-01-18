const express = require('express');
const router = express.Router();
const readingsController = require('../controllers/readingsController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public routes (optional auth)
router.get('/cards', readingsController.getAllCards);
router.get('/cards/random', readingsController.getRandomCards);
router.post('/interpret', optionalAuth, readingsController.getInterpretation);
router.post('/create', optionalAuth, readingsController.createReading);

// Protected routes (require auth)
router.get('/history', authenticate, readingsController.getHistory);
router.get('/:id', optionalAuth, readingsController.getReading);
router.delete('/:id', authenticate, readingsController.deleteReading);

module.exports = router;
