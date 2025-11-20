/**
 * RAG/Chatbot MS API Client
 * 
 * Handles communication with RAG MS with fallback to mock data.
 */

const { createAPIClient } = require('../utils/apiClient');

const ragClient = createAPIClient({
  baseURL: process.env.RAG_CHATBOT_URL || 'http://localhost:3007',
  mockFile: 'rag_response.json',
  apiName: 'RAG/Chatbot MS'
});

/**
 * Search skills/competencies for RAG MS
 * @param {string} query - Search query
 * @param {string} type - Search type ('skill', 'competency', or null for both)
 * @returns {Promise<Object>} Search results
 */
async function search(query, type = null) {
  try {
    const response = await ragClient.get(`/api/search?q=${encodeURIComponent(query)}&type=${type || ''}`, {
      Authorization: `Bearer ${process.env.RAG_CHATBOT_TOKEN || ''}`
    });

    return response;
  } catch (error) {
    // Fallback is handled by apiClient
    throw error;
  }
}

module.exports = {
  search
};

