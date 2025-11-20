/**
 * AI Service
 * 
 * Google Gemini API integration service.
 * Handles all AI operations including extraction, normalization, and validation.
 */

const fs = require('fs').promises;
const path = require('path');
const { getModel, executeWithRetry } = require('../../config/ai');

class AIService {
  /**
   * Load prompt from file
   * @param {string} promptPath - Path to prompt file
   * @returns {Promise<string>}
   */
  async loadPrompt(promptPath) {
    try {
      const fullPath = path.join(__dirname, '../../', promptPath);
      const prompt = await fs.readFile(fullPath, 'utf-8');
      return prompt.trim();
    } catch (error) {
      throw new Error(`Failed to load prompt from ${promptPath}: ${error.message}`);
    }
  }

  /**
   * Call Gemini API with prompt
   * @param {string} prompt - Prompt text
   * @param {Object} options - Options
   * @param {string} options.modelType - 'flash' or 'pro' (default: 'flash')
   * @param {Object} options.generationConfig - Generation configuration
   * @returns {Promise<string>} Response text
   */
  async callGemini(prompt, options = {}) {
    const { modelType = 'flash', generationConfig = {} } = options;
    
    const defaultConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      ...generationConfig
    };

    const model = getModel(modelType);

    return await executeWithRetry(async () => {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: defaultConfig
      });

      const response = await result.response;
      return response.text();
    });
  }

  /**
   * Call Gemini API and parse JSON response
   * @param {string} prompt - Prompt text
   * @param {Object} options - Options
   * @returns {Promise<Object>} Parsed JSON
   */
  async callGeminiJSON(prompt, options = {}) {
    try {
      const response = await this.callGemini(prompt, options);
      
      // Try to extract JSON from response (handle markdown code blocks)
      let jsonText = response.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
  }

  /**
   * Extract skills and competencies from raw data
   * @param {string} rawData - Raw user data (resume, LinkedIn, etc.)
   * @returns {Promise<Object>} Extracted data
   */
  async extractFromRawData(rawData) {
    const promptPath = 'docs/prompts/skill_extraction_from_profile_prompt.txt';
    let prompt = await this.loadPrompt(promptPath);
    
    // Replace placeholder with actual data
    prompt = prompt.replace('{raw_data}', rawData);

    return await this.callGeminiJSON(prompt, { modelType: 'flash' });
  }

  /**
   * Normalize extracted data
   * @param {Object} extractedData - Extracted competencies and skills
   * @returns {Promise<Object>} Normalized data
   */
  async normalizeData(extractedData) {
    const promptPath = 'docs/prompts/normalization_prompt.txt';
    let prompt = await this.loadPrompt(promptPath);
    
    // Replace placeholder with actual data
    prompt = prompt.replace('{extracted_data}', JSON.stringify(extractedData, null, 2));

    return await this.callGeminiJSON(prompt, { modelType: 'flash' });
  }

  /**
   * Validate extracted data structure
   * @param {Object} data - Data to validate
   * @returns {boolean}
   */
  validateExtractedData(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check for competencies array
    if (!Array.isArray(data.competencies)) {
      return false;
    }

    // Check for skills array
    if (!Array.isArray(data.skills)) {
      return false;
    }

    // Validate competency structure
    for (const competency of data.competencies) {
      if (!competency.name || typeof competency.name !== 'string') {
        return false;
      }
    }

    // Validate skill structure
    for (const skill of data.skills) {
      if (!skill.name || typeof skill.name !== 'string') {
        return false;
      }
    }

    return true;
  }
}

module.exports = new AIService();


