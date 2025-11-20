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

// Build initial profile
router.post('/:userId/initial-profile', userController.buildInitialProfile.bind(userController));

// Get user profile (unified)
router.get('/:userId/profile', userController.getUserProfile.bind(userController));

// Create or update user
router.post('/', userController.createOrUpdateUser.bind(userController));

// Update user
router.put('/:userId', userController.updateUser.bind(userController));

module.exports = router;


