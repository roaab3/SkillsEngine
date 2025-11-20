/**
 * Import Service
 * 
 * Handles importing competencies and skills from CSV.
 * Feature 7.3: CSV Processing & Import
 */

const csvParserService = require('./csvParserService');
const competencyRepository = require('../repositories/competencyRepository');
const skillRepository = require('../repositories/skillRepository');
const competencyService = require('./competencyService');
const skillService = require('./skillService');
const Competency = require('../models/Competency');
const Skill = require('../models/Skill');

class ImportService {
  /**
   * Import competencies and skills from CSV
   * @param {Array} rows - Parsed CSV rows
   * @param {Object} options - Import options
   * @returns {Promise<Object>} Import results
   */
  async importFromCSV(rows, options = {}) {
    const { skipDuplicates = true, validateOnly = false } = options;

    // Validate structure
    const structureValidation = csvParserService.validateStructure(rows, ['name', 'type']);
    if (!structureValidation.valid) {
      throw new Error(`CSV structure validation failed: ${structureValidation.errors.join(', ')}`);
    }

    // Validate security
    const securityValidation = csvParserService.validateSecurity(rows);
    if (!securityValidation.valid) {
      throw new Error(`Security validation failed: ${securityValidation.errors.join(', ')}`);
    }

    if (securityValidation.warnings.length > 0) {
      console.warn('Security warnings:', securityValidation.warnings);
    }

    // Detect duplicates
    const { duplicates, unique } = csvParserService.detectDuplicates(rows, ['name', 'type']);

    if (validateOnly) {
      return {
        valid: true,
        total_rows: rows.length,
        duplicates_count: duplicates.length,
        unique_count: unique.length,
        duplicates: duplicates.map(d => ({
          name: d.row.name,
          type: d.row.type
        }))
      };
    }

    // Separate competencies and skills
    const competencies = unique.filter(row => row.type?.toLowerCase() === 'competency');
    const skills = unique.filter(row => row.type?.toLowerCase() === 'skill');

    const results = {
      total_rows: rows.length,
      duplicates_count: duplicates.length,
      imported: {
        competencies: { success: 0, failed: 0, errors: [] },
        skills: { success: 0, failed: 0, errors: [] }
      }
    };

    // Import competencies
    for (const row of competencies) {
      try {
        const competencyData = {
          competency_id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          competency_name: row.name,
          description: row.description || null,
          parent_competency_id: row.parent_id || null
        };

        // Check for duplicates if skipDuplicates is true
        if (skipDuplicates) {
          const existing = await competencyRepository.findByName(row.name);
          if (existing) {
            results.imported.competencies.failed++;
            results.imported.competencies.errors.push({
              name: row.name,
              error: 'Duplicate competency found'
            });
            continue;
          }
        }

        await competencyService.createCompetency(competencyData);
        results.imported.competencies.success++;
      } catch (error) {
        results.imported.competencies.failed++;
        results.imported.competencies.errors.push({
          name: row.name,
          error: error.message
        });
      }
    }

    // Import skills
    for (const row of skills) {
      try {
        const skillData = {
          skill_id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          skill_name: row.name,
          description: row.description || null,
          parent_skill_id: row.parent_id || null
        };

        // Check for duplicates if skipDuplicates is true
        if (skipDuplicates) {
          const existing = await skillRepository.findByName(row.name);
          if (existing) {
            results.imported.skills.failed++;
            results.imported.skills.errors.push({
              name: row.name,
              error: 'Duplicate skill found'
            });
            continue;
          }
        }

        await skillService.createSkill(skillData);
        results.imported.skills.success++;
      } catch (error) {
        results.imported.skills.failed++;
        results.imported.skills.errors.push({
          name: row.name,
          error: error.message
        });
      }
    }

    return results;
  }
}

module.exports = new ImportService();

