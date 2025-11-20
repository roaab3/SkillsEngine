/**
 * Competency Sub-Competency Routes
 */

const express = require('express');
const router = express.Router();
const competencySubCompetencyController = require('../../../controllers/competencySubCompetencyController');

router
  .route('/:parentCompetencyId')
  .get(competencySubCompetencyController.getSubCompetencies.bind(competencySubCompetencyController))
  .post(competencySubCompetencyController.addSubCompetency.bind(competencySubCompetencyController));

router
  .route('/:parentCompetencyId/:childCompetencyId')
  .delete(competencySubCompetencyController.removeSubCompetency.bind(competencySubCompetencyController));

module.exports = router;


