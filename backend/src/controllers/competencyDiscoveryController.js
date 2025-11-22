/**
 * Competency Discovery Controller
 *
 * Exposes REST endpoints to trigger competency discovery
 * (internal lookup first, then external discovery via Gemini)
 * using SkillDiscoveryService.
 */

const skillDiscoveryService = require('../services/skillDiscoveryService');

class CompetencyDiscoveryController {
  /**
   * POST /api/competency-discovery/run
   * Trigger competency discovery for a given competency_name.
   *
   * Request body:
   * {
   *   "competency_name": "Data Analysis"
   * }
   */
  async runDiscovery(req, res) {
    try {
      const { competency_name } = req.body || {};

      if (!competency_name || typeof competency_name !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'competency_name (string) is required in the request body',
        });
      }

      // 1) Try internal lookup first
      const internal = await skillDiscoveryService.lookupByCompetency(competency_name);

      if (internal) {
        return res.status(200).json({
          success: true,
          source: 'internal',
          message: 'Competency found in internal taxonomy',
          competency: internal,
        });
      }

      // 2) Fall back to external discovery (Gemini) if not found
      const discovered = await skillDiscoveryService.discoverExternal(competency_name);

      return res.status(201).json({
        success: true,
        source: 'external',
        message: 'Competency discovered externally and stored in taxonomy',
        competency: discovered,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Competency discovery failed',
      });
    }
  }
}

module.exports = new CompetencyDiscoveryController();



