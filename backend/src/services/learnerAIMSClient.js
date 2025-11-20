/**
 * Learner AI MS API Client
 * 
 * Handles communication with Learner AI MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const learnerAIClient = createAPIClient({
  baseURL: process.env.LEARNER_AI_URL || 'http://localhost:3005',
  mockFile: 'learner_ai_response.json',
  apiName: 'Learner AI MS'
});

/**
 * Send gap analysis to Learner AI MS
 * @param {string} userId - User ID
 * @param {Object} gapAnalysis - Gap analysis data
 * @returns {Promise<Object>} Response from Learner AI MS
 */
async function sendGapAnalysis(userId, gapAnalysis) {
  try {
    const response = await learnerAIClient.post('/api/gap-analysis', {
      user_id: userId,
      gaps: gapAnalysis
    }, {
      Authorization: `Bearer ${process.env.LEARNER_AI_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  sendGapAnalysis
};

