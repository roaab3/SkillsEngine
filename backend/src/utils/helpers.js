/**
 * Helper Utilities
 */

/**
 * Generate unique ID
 */
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize string input
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Paginate array
 */
function paginate(array, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return {
    data: array.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep/delay utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function
 */
async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await sleep(delay * (i + 1));
    }
  }
}

module.exports = {
  generateId,
  sanitizeString,
  isValidEmail,
  paginate,
  deepClone,
  sleep,
  retry
};

