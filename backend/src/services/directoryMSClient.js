/**
 * Directory MS API Client
 * 
 * Handles communication with Directory MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const directoryClient = createAPIClient({
  baseURL: process.env.DIRECTORY_SERVICE_URL || 'http://localhost:3001',
  mockFile: 'directory_ms_response.json',
  apiName: 'Directory MS'
});

/**
 * Send initial profile to Directory MS
 * @param {string} userId - User ID
 * @param {Object} profile - Initial profile payload
 * @returns {Promise<Object>} Response from Directory MS
 */
async function sendInitialProfile(userId, profile) {
  try {
    const response = await directoryClient.post('/api/users/initial-profile', {
      userId,
      ...profile
    }, {
      Authorization: `Bearer ${process.env.DIRECTORY_SERVICE_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

/**
 * Get user data from Directory MS
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
async function getUserData(userId) {
  try {
    const response = await directoryClient.get(`/api/users/${userId}`, {
      Authorization: `Bearer ${process.env.DIRECTORY_SERVICE_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  sendInitialProfile,
  getUserData
};

