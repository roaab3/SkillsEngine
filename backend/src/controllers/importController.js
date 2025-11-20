/**
 * Import Controller
 * 
 * Handles CSV import requests.
 * Feature 7.1: CSV Upload Interface
 */

const multer = require('multer');
const csvParserService = require('../services/csvParserService');
const importService = require('../services/importService');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

class ImportController {
  /**
   * Upload and import CSV file
   * POST /api/competencies/import
   */
  async importCSV(req, res) {
    try {
      // Check if user is trainer (authorization middleware should set req.user)
      if (!req.user || req.user.employee_type !== 'trainer') {
        return res.status(403).json({
          success: false,
          error: 'Only trainers can import competencies and skills'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'CSV file is required'
        });
      }

      // Parse CSV
      const rows = await csvParserService.parseCSV(req.file.buffer);

      // Import data
      const results = await importService.importFromCSV(rows, {
        skipDuplicates: true
      });

      res.json({
        success: true,
        message: 'Import completed',
        data: results
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Validate CSV file without importing
   * POST /api/competencies/import/validate
   */
  async validateCSV(req, res) {
    try {
      if (!req.user || req.user.employee_type !== 'trainer') {
        return res.status(403).json({
          success: false,
          error: 'Only trainers can validate CSV files'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'CSV file is required'
        });
      }

      // Parse CSV
      const rows = await csvParserService.parseCSV(req.file.buffer);

      // Validate structure
      const structureValidation = csvParserService.validateStructure(rows, ['name', 'type']);

      // Validate security
      const securityValidation = csvParserService.validateSecurity(rows);

      // Detect duplicates
      const { duplicates } = csvParserService.detectDuplicates(rows, ['name', 'type']);

      // Validation-only import
      const importValidation = await importService.importFromCSV(rows, {
        validateOnly: true
      });

      res.json({
        success: true,
        message: 'Validation completed',
        data: {
          structure: structureValidation,
          security: securityValidation,
          duplicates: {
            count: duplicates.length,
            items: duplicates.map(d => ({
              name: d.row.name,
              type: d.row.type
            }))
          },
          import_preview: importValidation
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

// Export controller and multer middleware
module.exports = {
  controller: new ImportController(),
  upload: upload.single('csv')
};

