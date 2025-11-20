/**
 * User Competency Routes
 */

const express = require('express');
const router = express.Router();
const userCompetencyController = require('../../../controllers/userCompetencyController');

router
  .route('/:userId/:competencyId')
  .get(userCompetencyController.getUserCompetency.bind(userCompetencyController))
  .put(userCompetencyController.upsertUserCompetency.bind(userCompetencyController))
  .delete(userCompetencyController.deleteUserCompetency.bind(userCompetencyController));

router
  .route('/:userId')
  .get(userCompetencyController.getUserCompetencies.bind(userCompetencyController));

module.exports = router;


