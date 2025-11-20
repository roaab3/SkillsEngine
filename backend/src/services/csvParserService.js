/**
 * CSV Parser Service
 * 
 * Handles CSV file parsing, validation, and security checks.
 * Feature 7.2: CSV Security Validation
 * Feature 7.3: CSV Processing & Import
 */

const fs = require('fs').promises;
const csv = require('csv-parser');
const { Readable } = require('stream');

class CSVParserService {
  /**
   * Parse CSV file from buffer or file path
   * @param {Buffer|string} input - CSV file buffer or file path
   * @returns {Promise<Array>} Parsed rows
   */
  async parseCSV(input) {
    return new Promise((resolve, reject) => {
      const rows = [];
      let stream;

      if (Buffer.isBuffer(input)) {
        stream = Readable.from(input.toString('utf-8'));
      } else if (typeof input === 'string') {
        stream = fs.createReadStream(input);
      } else {
        return reject(new Error('Invalid input: must be Buffer or file path'));
      }

      stream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Validate CSV structure
   * @param {Array} rows - Parsed CSV rows
   * @param {Array} requiredColumns - Required column names
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateStructure(rows, requiredColumns = []) {
    const errors = [];

    if (!Array.isArray(rows) || rows.length === 0) {
      errors.push('CSV file is empty or invalid');
      return { valid: false, errors };
    }

    // Check required columns
    if (requiredColumns.length > 0) {
      const firstRow = rows[0];
      const missingColumns = requiredColumns.filter(
        col => !firstRow.hasOwnProperty(col)
      );

      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for SQL injection patterns
   * @param {string} text - Text to check
   * @returns {boolean} True if suspicious pattern found
   */
  checkSQLInjection(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
      /('|(\\')|(;)|(\\)|(\/\*)|(\*\/)|(\-\-)|(\+)|(\%)/,
      /(\bor\b\s*\d+\s*=\s*\d+)/i,
      /(\band\b\s*\d+\s*=\s*\d+)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check for prompt injection patterns
   * @param {string} text - Text to check
   * @returns {boolean} True if suspicious pattern found
   */
  checkPromptInjection(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    const promptPatterns = [
      /(\b(ignore|forget|disregard|override|system|admin|root)\b)/i,
      /(\[SYSTEM\]|\[ADMIN\]|\[ROOT\]|\[IGNORE\])/i,
      /(you are|you're|act as|pretend to be|roleplay)/i,
      /(new instructions|updated instructions|revised instructions)/i
    ];

    return promptPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Validate CSV data for security threats
   * @param {Array} rows - Parsed CSV rows
   * @returns {Object} { valid: boolean, errors: string[], warnings: string[] }
   */
  validateSecurity(rows) {
    const errors = [];
    const warnings = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because CSV has header and 0-indexed

      for (const [key, value] of Object.entries(row)) {
        const cellValue = String(value);

        // Check SQL injection
        if (this.checkSQLInjection(cellValue)) {
          errors.push(`Row ${rowNum}, column "${key}": Potential SQL injection detected`);
        }

        // Check prompt injection
        if (this.checkPromptInjection(cellValue)) {
          warnings.push(`Row ${rowNum}, column "${key}": Potential prompt injection detected`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Detect duplicate rows
   * @param {Array} rows - Parsed CSV rows
   * @param {Array} keyColumns - Columns to use for duplicate detection
   * @returns {Object} { duplicates: Array, unique: Array }
   */
  detectDuplicates(rows, keyColumns = []) {
    if (keyColumns.length === 0) {
      // Use all columns as key
      keyColumns = Object.keys(rows[0] || {});
    }

    const seen = new Map();
    const duplicates = [];
    const unique = [];

    for (const row of rows) {
      const key = keyColumns.map(col => String(row[col] || '')).join('|');
      const normalizedKey = key.toLowerCase().trim();

      if (seen.has(normalizedKey)) {
        duplicates.push({
          row,
          originalIndex: seen.get(normalizedKey),
          duplicateIndex: rows.indexOf(row)
        });
      } else {
        seen.set(normalizedKey, rows.indexOf(row));
        unique.push(row);
      }
    }

    return { duplicates, unique };
  }
}

module.exports = new CSVParserService();

