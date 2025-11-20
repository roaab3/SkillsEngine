/**
 * User Skill Routes
 */

const express = require('express');
const router = express.Router();
const userSkillController = require('../../../controllers/userSkillController');

router
  .route('/:userId/:skillId')
  .get(userSkillController.getUserSkill.bind(userSkillController))
  .put(userSkillController.upsertUserSkill.bind(userSkillController))
  .delete(userSkillController.deleteUserSkill.bind(userSkillController));

router
  .route('/:userId')
  .get(userSkillController.getUserSkills.bind(userSkillController));

module.exports = router;


