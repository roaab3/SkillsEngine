/**
 * Web Extraction Controller (Feature 9.2)
 *
 * Admin/internal endpoints to trigger web deep search & skill extraction
 * from external source URLs using Gemini + semantic_extraction_prompt.txt.
 */

const webExtractionService = require('../services/webExtractionService');

class WebExtractionController {
  /**
   * POST /api/web-extraction/run
   *
   * Trigger web extraction. Two modes:
   * - If body.urls (array of strings) is provided, extract from those URLs.
   * - Otherwise, extract from all known official_sources.reference_index_url.
   *
   * Example body:
   * {
   *   "urls": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference"]
   * }
   */
  async runExtraction(req, res) {
    try {
      const { urls } = req.body || {};

      let result;
      if (Array.isArray(urls) && urls.length > 0) {
        result = await webExtractionService.extractFromUrls(urls);
      } else {
        result = await webExtractionService.extractFromOfficialSources();
      }

      return res.status(200).json({
        success: true,
        sources: result.sources || [],
        stats: result.stats || { competencies: 0, skills: 0 },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Web extraction failed',
      });
    }
  }
}

module.exports = new WebExtractionController();



