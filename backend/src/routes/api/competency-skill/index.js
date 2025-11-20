/**
 * Competency Skill Routes
 */

const express = require('express');
const router = express.Router();
const competencySkillController = require('../../../controllers/competencySkillController');

router
  .route('/:competencyId')
  .get(competencySkillController.getLinkedSkills.bind(competencySkillController))
  .post(competencySkillController.addSkills.bind(competencySkillController));

router
  .route('/:competencyId/:skillId')
  .delete(competencySkillController.removeSkill.bind(competencySkillController));

module.exports = router;


