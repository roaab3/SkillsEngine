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

// Get all parent competencies
router.get('/parents', competencyController.getParentCompetencies.bind(competencyController));

// Search competencies
router.get('/search', competencyController.searchCompetencies.bind(competencyController));

// Get competency hierarchy
router.get('/:competencyId/hierarchy', competencyController.getCompetencyHierarchy.bind(competencyController));

// Get required MGS
router.get('/:competencyId/mgs', competencyController.getRequiredMGS.bind(competencyController));

// Link skills to competency
router.post('/:competencyId/skills', competencyController.linkSkills.bind(competencyController));

// Get competency by ID
router.get('/:competencyId', competencyController.getCompetencyById.bind(competencyController));

// Create competency
router.post('/', competencyController.createCompetency.bind(competencyController));

// Update competency
router.put('/:competencyId', competencyController.updateCompetency.bind(competencyController));

// Delete competency
router.delete('/:competencyId', competencyController.deleteCompetency.bind(competencyController));

module.exports = router;


