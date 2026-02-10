const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// POST /api/logs - Create a new log entry
router.post('/', logController.createLog.bind(logController));

// GET /api/logs - Get all logs
router.get('/', logController.getAllLogs.bind(logController));

module.exports = router;
