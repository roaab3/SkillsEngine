/**
 * Logger Utility
 * 
 * Centralized logging for the application.
 */

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'INFO';

class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Format log message
   */
  format(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      context: this.context,
      message,
      ...data
    };
  }

  /**
   * Log error
   */
  error(message, error = null) {
    if (this.shouldLog('ERROR')) {
      const logData = this.format('ERROR', message, {
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : null
      });
      console.error(JSON.stringify(logData));
    }
  }

  /**
   * Log warning
   */
  warn(message, data = {}) {
    if (this.shouldLog('WARN')) {
      const logData = this.format('WARN', message, data);
      console.warn(JSON.stringify(logData));
    }
  }

  /**
   * Log info
   */
  info(message, data = {}) {
    if (this.shouldLog('INFO')) {
      const logData = this.format('INFO', message, data);
      console.log(JSON.stringify(logData));
    }
  }

  /**
   * Log debug
   */
  debug(message, data = {}) {
    if (this.shouldLog('DEBUG')) {
      const logData = this.format('DEBUG', message, data);
      console.log(JSON.stringify(logData));
    }
  }

  /**
   * Check if should log at this level
   */
  shouldLog(level) {
    return logLevels[level] <= logLevels[currentLogLevel];
  }
}

module.exports = Logger;

