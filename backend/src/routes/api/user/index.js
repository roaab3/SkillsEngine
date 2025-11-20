/**
 * User API Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');

// Extract from raw data
router.post('/:userId/extract', userController.extractFromRawData.bind(userController));

// Normalize data
router.post('/:userId/normalize', userController.normalizeData.bind(userController));

// Get user basic profile (no skills/competencies)
router.get('/:userId', userController.getUserProfile.bind(userController));

// Create or update user
router.post('/', userController.createOrUpdateUser.bind(userController));

// Update user
router.put('/:userId', userController.updateUser.bind(userController));

module.exports = router;


