/**
 * Competency Sub-Competency Routes
 */

const express = require('express');
const router = express.Router();
const competencySubCompetencyController = require('../../../controllers/competencySubCompetencyController');
const { authenticate } = require('../../../middleware/auth');
const { requireTrainer } = require('../../../middleware/authorization');

// Get all parent competencies (must be before /:parentCompetencyId route)
router.get('/parents', competencySubCompetencyController.getAllParents.bind(competencySubCompetencyController));

router
  .route('/:parentCompetencyId')
  .get(competencySubCompetencyController.getSubCompetencies.bind(competencySubCompetencyController))
  .post(authenticate, requireTrainer, competencySubCompetencyController.addSubCompetency.bind(competencySubCompetencyController))
  .put(authenticate, requireTrainer, competencySubCompetencyController.addSubCompetency.bind(competencySubCompetencyController))
  .delete(authenticate, requireTrainer, competencySubCompetencyController.removeSubCompetency.bind(competencySubCompetencyController));

module.exports = router;


