/**
 * API Client with Fallback to Mock Data
 * 
 * Handles external API calls with automatic fallback to mock data on failure.
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Simple logger for API client
const logger = {
  info: (message, data) => console.log(`[API Client] ${message}`, data || ''),
  warn: (message, data) => console.warn(`[API Client] ${message}`, data || ''),
  error: (message, error) => console.error(`[API Client] ${message}`, error || '')
};

/**
 * Load mock data from file
 * @param {string} mockFileName - Name of mock file (e.g., 'users.json')
 * @returns {Promise<Object>} Mock data
 */
async function loadMockData(mockFileName) {
  try {
    const mockPath = path.join(__dirname, '../../mockdata', mockFileName);
    const data = await fs.readFile(mockPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Failed to load mock data from ${mockFileName}`, error);
    throw new Error(`Mock data file ${mockFileName} not found or invalid`);
  }
}

/**
 * Log API fallback to change_log.json
 * @param {string} apiName - Name of the API
 * @param {string} error - Error message
 * @param {string} mockFile - Mock file used
 */
async function logFallback(apiName, error, mockFile) {
  try {
    const changeLogPath = path.join(__dirname, '../../../customize/change_log.json');
    const changeLog = JSON.parse(await fs.readFile(changeLogPath, 'utf-8'));
    
    changeLog.push({
      timestamp: new Date().toISOString(),
      changed_by: 'system',
      change_type: 'api_fallback',
      description: `API fallback triggered for ${apiName}. Error: ${error}. Using mock data from ${mockFile}`,
      status: 'applied',
      files_affected: [`backend/mockdata/${mockFile}`]
    });

    await fs.writeFile(changeLogPath, JSON.stringify(changeLog, null, 2));
  } catch (logError) {
    logger.warn('Failed to log API fallback', { error: logError.message });
  }
}

/**
 * Call external API with fallback to mock data
 * @param {Object} options - API call options
 * @param {string} options.url - API URL
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {Object} [options.data] - Request body
 * @param {Object} [options.headers] - Request headers
 * @param {string} options.mockFile - Mock data file name (e.g., 'users.json')
 * @param {string} options.apiName - Name of the API (for logging)
 * @param {number} [options.timeout] - Request timeout in ms (default: 5000)
 * @returns {Promise<Object>} API response or mock data
 */
async function callWithFallback({
  url,
  method = 'GET',
  data = null,
  headers = {},
  mockFile,
  apiName,
  timeout = 5000
}) {
  try {
    // Try real API call
    const config = {
      method,
      url,
      headers,
      timeout,
      ...(data && { data })
    };

    const response = await axios(config);
    logger.info(`API call successful: ${apiName}`, { url, status: response.status });
    return response.data;
  } catch (error) {
    // Check if it's a failure that should trigger fallback
    const shouldFallback = 
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.response?.status >= 500 ||
      error.message?.includes('timeout');

    if (shouldFallback) {
      logger.warn(`API call failed, using mock data: ${apiName}`, {
        url,
        error: error.message,
        code: error.code,
        status: error.response?.status
      });

      // Log fallback
      await logFallback(apiName, error.message || error.code || 'Unknown error', mockFile);

      // Load and return mock data
      const mockData = await loadMockData(mockFile);
      logger.info(`Mock data loaded for ${apiName}`, { mockFile });
      return mockData;
    }

    // For other errors (4xx, validation, etc.), throw the error
    throw error;
  }
}

/**
 * Create API client for specific microservice
 * @param {Object} config - Client configuration
 * @param {string} config.baseURL - Base URL for the API
 * @param {string} config.mockFile - Mock data file name
 * @param {string} config.apiName - Name of the API
 * @returns {Object} API client with methods
 */
function createAPIClient({ baseURL, mockFile, apiName }) {
  return {
    /**
     * GET request with fallback
     */
    get: async (endpoint, headers = {}) => {
      return callWithFallback({
        url: `${baseURL}${endpoint}`,
        method: 'GET',
        headers,
        mockFile,
        apiName: `${apiName} - GET ${endpoint}`
      });
    },

    /**
     * POST request with fallback
     */
    post: async (endpoint, data, headers = {}) => {
      return callWithFallback({
        url: `${baseURL}${endpoint}`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        mockFile,
        apiName: `${apiName} - POST ${endpoint}`
      });
    },

    /**
     * PUT request with fallback
     */
    put: async (endpoint, data, headers = {}) => {
      return callWithFallback({
        url: `${baseURL}${endpoint}`,
        method: 'PUT',
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        mockFile,
        apiName: `${apiName} - PUT ${endpoint}`
      });
    },

    /**
     * DELETE request with fallback
     */
    delete: async (endpoint, headers = {}) => {
      return callWithFallback({
        url: `${baseURL}${endpoint}`,
        method: 'DELETE',
        headers,
        mockFile,
        apiName: `${apiName} - DELETE ${endpoint}`
      });
    }
  };
}

module.exports = {
  callWithFallback,
  loadMockData,
  createAPIClient,
  logFallback
};

