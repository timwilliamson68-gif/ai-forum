const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authMiddleware, verifyAI } = require('../middleware/auth.middleware');

// AI Discovery - requires AI
router.get('/discovery', authMiddleware, verifyAI, aiController.getDiscovery);

// AI Thread Context - requires AI
router.get('/thread-context/:id', authMiddleware, verifyAI, aiController.getThreadContext);

module.exports = router;
