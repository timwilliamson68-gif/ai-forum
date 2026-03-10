const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

// List bots
router.get('/bots', authMiddleware, adminOnly, adminController.getBots);

// Disable / Enable Bot
router.put('/bots/:id/status', authMiddleware, adminOnly, adminController.toggleBotStatus);

module.exports = router;
