/**
 * Content Studio MS Handler
 * 
 * Handles requests from Content Studio MS.
 */

const competencyService = require('../../services/competencyService');

class ContentStudioHandler {
  /**
   * Process Content Studio MS request
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @returns {Promise<Object>} Response data
   */
  async process(payload, responseTemplate) {
    try {
      const { competency_id } = payload;

      if (!competency_id) {
        return {
          status: 'error',
          message: 'competency_id is required',
          data: {}
        };
      }

      // Get all related skills for this competency
      const skills = await competencyService.getRequiredMGS(competency_id);

      return {
        status: 'success',
        message: 'Skills retrieved successfully',
        data: {
          ...responseTemplate?.data,
          competency_id,
          skills: skills
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

module.exports = new ContentStudioHandler();


