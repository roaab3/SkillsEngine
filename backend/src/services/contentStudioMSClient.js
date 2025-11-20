/**
 * Content Studio MS API Client
 * 
 * Handles communication with Content Studio MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const contentStudioClient = createAPIClient({
  baseURL: process.env.CONTENT_STUDIO_URL || 'http://localhost:3003',
  mockFile: 'content_studio_response.json',
  apiName: 'Content Studio MS'
});

/**
 * Send skills data to Content Studio MS
 * @param {string} competencyId - Competency ID
 * @param {Array} skills - Skills array
 * @returns {Promise<Object>} Response from Content Studio MS
 */
async function sendSkillsData(competencyId, skills) {
  try {
    const response = await contentStudioClient.post('/api/competencies/skills', {
      competency_id: competencyId,
      skills: skills
    }, {
      Authorization: `Bearer ${process.env.CONTENT_STUDIO_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  sendSkillsData
};

