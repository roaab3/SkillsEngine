/**
 * Course Builder MS API Client
 * 
 * Handles communication with Course Builder MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const courseBuilderClient = createAPIClient({
  baseURL: process.env.COURSE_BUILDER_URL || 'http://localhost:3004',
  mockFile: 'course_builder_response.json',
  apiName: 'Course Builder MS'
});

/**
 * Get skills for competency
 * @param {string} competencyName - Competency name
 * @returns {Promise<Object>} Skills data
 */
async function getSkillsForCompetency(competencyName) {
  try {
    const response = await courseBuilderClient.get(`/api/competencies/${competencyName}/skills`, {
      Authorization: `Bearer ${process.env.COURSE_BUILDER_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  getSkillsForCompetency
};

