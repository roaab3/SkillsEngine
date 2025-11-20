/**
 * Course Builder MS Handler
 * 
 * Handles requests from Course Builder MS.
 */

const skillDiscoveryService = require('../../services/skillDiscoveryService');

class CourseBuilderHandler {
  /**
   * Process Course Builder MS request
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @returns {Promise<Object>} Response data
   */
  async process(payload, responseTemplate) {
    try {
      const { competency_name, user_id } = payload;

      if (!competency_name) {
        return {
          status: 'error',
          message: 'competency_name is required',
          data: {}
        };
      }

      // Look up competency and get skills
      const result = await skillDiscoveryService.lookupByCompetency(competency_name);

      if (!result) {
        // Trigger external discovery
        const discovered = await skillDiscoveryService.discoverExternal(competency_name);
        return {
          status: 'success',
          message: 'Competency discovered externally',
          data: {
            ...responseTemplate?.data,
            ...discovered
          }
        };
      }

      return {
        status: 'success',
        message: 'Skills retrieved successfully',
        data: {
          ...responseTemplate?.data,
          ...result
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

module.exports = new CourseBuilderHandler();


