/**
 * Competencies API Routes
 */

const express = require('express');
const router = express.Router();
const competencyController = require('../../../controllers/competencyController');
const { controller: importController, upload } = require('../../../controllers/importController');

// CSV Import (trainer only)
router.post('/import', upload, importController.importCSV.bind(importController));
router.post('/import/validate', upload, importController.validateCSV.bind(importController));

// Get all competencies (must be before /:competencyId route)
router.get('/', competencyController.getAllCompetencies.bind(competencyController));

// Search competencies by name (case-insensitive, ?q=pattern)
router.get('/search', competencyController.searchCompetencies.bind(competencyController));



// Get competency by ID
router.get('/:competencyId', competencyController.getCompetencyById.bind(competencyController));

// Create competency
router.post('/', competencyController.createCompetency.bind(competencyController));

// Update competency
router.put('/:competencyId', competencyController.updateCompetency.bind(competencyController));

// Delete competency
router.delete('/:competencyId', competencyController.deleteCompetency.bind(competencyController));

module.exports = router;


