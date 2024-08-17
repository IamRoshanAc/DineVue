const express = require('express');
const router = express.Router();
const auditLogsController = require('../controllers/auditController'); // Adjust path to controller

// Route to get all audit logs
router.get('', auditLogsController.getAuditLogs);


module.exports = router;
