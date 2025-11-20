/**
 * Skills API Routes
 */

const express = require('express');
const router = express.Router();
const skillController = require('../../../controllers/skillController');

// Get all root skills
router.get('/roots', skillController.getRootSkills.bind(skillController));

// Search skills
router.get('/search', skillController.searchSkills.bind(skillController));

// Get skill tree
router.get('/:skillId/tree', skillController.getSkillTree.bind(skillController));

// Get MGS for a skill
router.get('/:skillId/mgs', skillController.getMGS.bind(skillController));

// Get skill by ID
router.get('/:skillId', skillController.getSkillById.bind(skillController));

// Create skill
router.post('/', skillController.createSkill.bind(skillController));

// Update skill
router.put('/:skillId', skillController.updateSkill.bind(skillController));

// Delete skill
router.delete('/:skillId', skillController.deleteSkill.bind(skillController));

module.exports = router;


