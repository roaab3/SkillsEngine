/**
 * Learner AI MS Handler
 * 
 * Handles requests from Learner AI MS.
 */

const gapAnalysisService = require('../../services/gapAnalysisService');
const competencyService = require('../../services/competencyService');

class LearnerAIHandler {
  /**
   * Process Learner AI MS request
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @returns {Promise<Object>} Response data
   */
  async process(payload, responseTemplate) {
    try {
      const { user_id, competency_id } = payload;

      if (!user_id) {
        return {
          status: 'error',
          message: 'user_id is required',
          data: {}
        };
      }

      // Calculate gap analysis
      const gaps = await gapAnalysisService.calculateGapAnalysis(user_id, competency_id);

      // Send to Learner AI MS (with fallback to mock data)
      const learnerAIMSClient = require('../../services/learnerAIMSClient');
      try {
        await learnerAIMSClient.sendGapAnalysis(user_id, gaps);
      } catch (error) {
        // Fallback is handled by apiClient
        console.warn('Failed to send gap analysis to Learner AI MS, using mock data:', error.message);
      }

      // If competency_id specified, get related skills
      let relatedSkills = [];
      if (competency_id) {
        relatedSkills = await competencyService.getRequiredMGS(competency_id);
      }

      return {
        status: 'success',
        message: 'Gap analysis calculated',
        data: {
          ...responseTemplate?.data,
          user_id,
          gaps: gaps,
          related_skills: relatedSkills
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: {}
      };
    }
  }
}

module.exports = new LearnerAIHandler();


