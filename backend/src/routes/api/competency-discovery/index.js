/**
 * Competency Discovery API Routes
 *
 * Routes to trigger internal/external competency discovery and
 * return the resulting competency + skills.
 */

const express = require('express');
const router = express.Router();
const competencyDiscoveryController = require('../../../controllers/competencyDiscoveryController');

// In a real system you'd add auth/role middleware here, e.g.:
// const { requireAdmin } = require('../../../middleware/authorization');
// router.post('/run', requireAdmin, competencyDiscoveryController.runDiscovery.bind(competencyDiscoveryController));

// POST /api/competency-discovery/run → trigger discovery
router.post('/run', competencyDiscoveryController.runDiscovery.bind(competencyDiscoveryController));

// Convenience alias: POST /api/competency-discovery also triggers discovery
router.post('/', competencyDiscoveryController.runDiscovery.bind(competencyDiscoveryController));

// Simple GET to verify the route is wired (does NOT trigger discovery)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Competency discovery API is available. Use POST /api/competency-discovery/run with { "competency_name": "..." } to trigger discovery.',
  });
});

module.exports = router;



