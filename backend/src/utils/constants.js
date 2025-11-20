/**
 * Application Constants
 */

module.exports = {
  // User types
  USER_TYPES: {
    REGULAR: 'regular',
    TRAINER: 'trainer'
  },

  // Proficiency levels
  PROFICIENCY_LEVELS: {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
    EXPERT: 'EXPERT'
  },

  // Skill verification status
  SKILL_STATUS: {
    UNVERIFIED: 'unverified',
    VERIFIED: 'verified'
  },

  // Skill sources
  SKILL_SOURCES: {
    ASSESSMENT: 'assessment',
    CERTIFICATION: 'certification',
    CLAIM: 'claim',
    AI: 'ai'
  },

  // API response status
  RESPONSE_STATUS: {
    SUCCESS: 'success',
    ERROR: 'error'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel']
  }
};

