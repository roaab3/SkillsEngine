/**
 * RAG/Chatbot MS Handler
 * 
 * Handles requests from RAG/Chatbot MS.
 */

const skillRepository = require('../../repositories/skillRepository');
const competencyRepository = require('../../repositories/competencyRepository');

class RAGHandler {
  /**
   * Process RAG MS request
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @returns {Promise<Object>} Response data
   */
  async process(payload, responseTemplate) {
    try {
      const { query, type } = payload;

      if (!query) {
        return {
          status: 'error',
          message: 'query is required',
          data: {}
        };
      }

      let results = [];

      if (type === 'skill' || !type) {
        const skills = await skillRepository.searchByName(query, { limit: 10 });
        results.push(...skills.map(s => ({ type: 'skill', ...s.toJSON() })));
      }

      if (type === 'competency' || !type) {
        const competencies = await competencyRepository.searchByName(query, { limit: 10 });
        results.push(...competencies.map(c => ({ type: 'competency', ...c.toJSON() })));
      }

      return {
        status: 'success',
        message: 'Search completed',
        data: {
          ...responseTemplate?.data,
          query,
          results: results
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

module.exports = new RAGHandler();


