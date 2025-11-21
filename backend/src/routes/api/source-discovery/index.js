/**
 * Source Discovery API Routes
 *
 * Admin-only routes to trigger external source (URL) discovery
 * and store the results in the official_sources table.
 */

const express = require('express');
const router = express.Router();
const sourceDiscoveryController = require('../../../controllers/sourceDiscoveryController');

// In a real system you'd add auth/role middleware here, e.g.:
// const { requireAdmin } = require('../../../middleware/authorization');
// router.post('/run', requireAdmin, sourceDiscoveryController.runDiscovery.bind(sourceDiscoveryController));

// For now, expose a simple POST endpoint:
router.post('/run', sourceDiscoveryController.runDiscovery.bind(sourceDiscoveryController));

module.exports = router;


