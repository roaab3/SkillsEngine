/**
 * Web Extraction API Routes (Feature 9.2)
 *
 * Routes to trigger web deep search & skill extraction from external URLs.
 */

const express = require('express');
const router = express.Router();
const webExtractionController = require('../../../controllers/webExtractionController');

// In a real system you'd add auth/role middleware here, e.g.:
// const { requireAdmin } = require('../../../middleware/authorization');
// router.post('/run', requireAdmin, webExtractionController.runExtraction.bind(webExtractionController));

// POST /api/web-extraction/run → trigger extraction
router.post('/run', webExtractionController.runExtraction.bind(webExtractionController));

// Convenience alias: POST /api/web-extraction also triggers extraction
router.post('/', webExtractionController.runExtraction.bind(webExtractionController));

// Simple GET to verify the route is wired (does NOT trigger extraction)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message:
      'Web Extraction API is available. Use POST /api/web-extraction/run with optional { "urls": ["https://..."] } to trigger extraction.',
  });
});

module.exports = router;



