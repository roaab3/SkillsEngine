/**
 * Learning Analytics MS API Client
 * 
 * Handles communication with Learning Analytics MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const analyticsClient = createAPIClient({
  baseURL: process.env.LEARNING_ANALYTICS_URL || 'http://localhost:3006',
  mockFile: 'analytics_response.json',
  apiName: 'Learning Analytics MS'
});

/**
 * Send user profile data to Learning Analytics MS
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Response from Learning Analytics MS
 */
async function sendUserProfile(userId, profileData) {
  try {
    const response = await analyticsClient.post('/api/users/profile', {
      user_id: userId,
      ...profileData
    }, {
      Authorization: `Bearer ${process.env.LEARNING_ANALYTICS_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  sendUserProfile
};

