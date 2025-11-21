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

// POST /api/source-discovery/run → trigger discovery
router.post('/run', sourceDiscoveryController.runDiscovery.bind(sourceDiscoveryController));

// Convenience alias: POST /api/source-discovery also triggers discovery
router.post('/', sourceDiscoveryController.runDiscovery.bind(sourceDiscoveryController));

// Simple GET to verify the route is wired (does NOT trigger discovery)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Source discovery API is available. Use POST /api/source-discovery/run to trigger discovery.',
  });
});

module.exports = router;


