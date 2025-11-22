/**
 * AI Configuration
 * 
 * Google Gemini API configuration and client setup.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configurations
const MODELS = {
  FLASH: process.env.GEMINI_FLASH_MODEL || 'gemini-2.5-flash',
  PRO: process.env.GEMINI_DEEP_SEARCH_MODEL || 'gemini-2.5-pro'
};

/**
 * Get Gemini model instance
 * @param {string} modelType - 'flash' or 'pro'
 * @returns {Object} Model instance
 */
function getModel(modelType = 'flash') {
  const modelName = modelType === 'pro' ? MODELS.PRO : MODELS.FLASH;
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
};

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute API call with retry logic
 * @param {Function} apiCall - Async function that returns a promise
 * @param {Object} options - Retry options
 * @returns {Promise} API response
 */
async function executeWithRetry(apiCall, options = {}) {
  const config = { ...RETRY_CONFIG, ...options };
  let lastError;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors (e.g., authentication, invalid input)
      if (error.message?.includes('API_KEY') || error.message?.includes('400')) {
        throw error;
      }

      if (attempt < config.maxRetries - 1) {
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

module.exports = {
  genAI,
  getModel,
  MODELS,
  executeWithRetry,
  RETRY_CONFIG
};


