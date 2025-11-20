/**
 * Unified Data Exchange Protocol Handler
 * 
 * Single endpoint for all microservice communications.
 * POST /api/fill-content-metrics/
 */

const directoryHandler = require('./directory/index');
const assessmentHandler = require('./assessment/index');
const courseBuilderHandler = require('./courses/index');
const contentStudioHandler = require('./content/index');
const learnerAIHandler = require('./learner/index');
const analyticsHandler = require('./analytics/index');
const ragHandler = require('./rag/index');

// Service to handler mapping
const HANDLER_MAP = {
  'directory-ms': directoryHandler,
  'assessment-ms': assessmentHandler,
  'course-builder-ms': courseBuilderHandler,
  'content-studio-ms': contentStudioHandler,
  'learner-ai-ms': learnerAIHandler,
  'learning-analytics-ms': analyticsHandler,
  'rag-ms': ragHandler
};

class UnifiedEndpointHandler {
  /**
   * Route request to appropriate handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handle(req, res) {
    try {
      const { requester_service, payload, response: responseTemplate } = req.body;

      // Validate request structure
      if (!requester_service) {
        return res.status(400).json({
          response: {
            status: 'error',
            message: 'requester_service is required',
            data: {}
          }
        });
      }

      // Get handler for this service
      const handler = HANDLER_MAP[requester_service];
      if (!handler) {
        return res.status(400).json({
          response: {
            status: 'error',
            message: `Unknown requester_service: ${requester_service}`,
            data: {}
          }
        });
      }

      // Route to handler
      const result = await handler.process(payload, responseTemplate);

      // Return in unified format
      res.json({
        requester_service,
        payload,
        response: result
      });
    } catch (error) {
      res.status(500).json({
        response: {
          status: 'error',
          message: error.message,
          data: {}
        }
      });
    }
  }
}

module.exports = new UnifiedEndpointHandler();


