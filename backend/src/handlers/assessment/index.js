/**
 * Assessment MS Handler
 * 
 * Handles requests from Assessment MS (exam results).
 */

const verificationService = require('../../services/verificationService');

class AssessmentHandler {
  /**
   * Process Assessment MS request
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @returns {Promise<Object>} Response data
   */
  async process(payload, responseTemplate) {
    try {
      const { user_id, exam_type, exam_results } = payload;

      if (!user_id || !exam_results) {
        return {
          status: 'error',
          message: 'user_id and exam_results are required',
          data: {}
        };
      }

      // Process exam results
      let result;
      if (exam_type === 'baseline') {
        result = await verificationService.processBaselineExamResults(user_id, exam_results);
      } else if (exam_type === 'post-course') {
        result = await verificationService.processPostCourseExamResults(user_id, exam_results);
      } else {
        return {
          status: 'error',
          message: 'Invalid exam_type. Must be "baseline" or "post-course"',
          data: {}
        };
      }

      return {
        status: 'success',
        message: 'Exam results processed successfully',
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

module.exports = new AssessmentHandler();


