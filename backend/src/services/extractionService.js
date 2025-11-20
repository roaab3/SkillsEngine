/**
 * Extraction Service
 * 
 * Handles AI extraction of skills and competencies from raw user data.
 * Feature 2.2: AI Extraction of Raw Data
 */

const aiService = require('./aiService');
const userRepository = require('../repositories/userRepository');

class ExtractionService {
  /**
   * Extract competencies and skills from raw user data
   * @param {string} userId - User ID
   * @param {string} rawData - Raw data (resume, LinkedIn, GitHub, etc.)
   * @returns {Promise<Object>} Extracted data with competencies and skills arrays
   */
  async extractFromUserData(userId, rawData) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Chunk large data if needed (Gemini has token limits)
    const chunkedData = this.chunkData(rawData, 50000); // ~50k characters per chunk

    let allExtracted = {
      competencies: [],
      skills: []
    };

    // Process each chunk
    for (const chunk of chunkedData) {
      try {
        const extracted = await aiService.extractFromRawData(chunk);
        
        // Validate structure
        if (!aiService.validateExtractedData(extracted)) {
          throw new Error('Invalid extracted data structure');
        }

        // Merge results
        allExtracted.competencies.push(...(extracted.competencies || []));
        allExtracted.skills.push(...(extracted.skills || []));
      } catch (error) {
        console.error(`Error extracting from chunk: ${error.message}`);
        throw error;
      }
    }

    // Remove duplicates by name (case-insensitive)
    allExtracted.competencies = this.deduplicateByName(allExtracted.competencies);
    allExtracted.skills = this.deduplicateByName(allExtracted.skills);

    // TODO: Emit extraction event for downstream processing
    // eventEmitter.emit('extraction.completed', { userId, extracted: allExtracted });

    return allExtracted;
  }

  /**
   * Chunk large text data for processing
   * @param {string} data - Text data
   * @param {number} maxChunkSize - Maximum chunk size in characters
   * @returns {string[]} Array of chunks
   */
  chunkData(data, maxChunkSize = 50000) {
    if (!data || data.length <= maxChunkSize) {
      return [data];
    }

    const chunks = [];
    let currentChunk = '';

    // Try to split by paragraphs or sentences
    const paragraphs = data.split(/\n\n+/);
    
    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
        
        // If single paragraph is too large, split by sentences
        if (paragraph.length > maxChunkSize) {
          const sentences = paragraph.split(/[.!?]+\s+/);
          for (const sentence of sentences) {
            if (currentChunk.length + sentence.length > maxChunkSize) {
              if (currentChunk) {
                chunks.push(currentChunk);
                currentChunk = '';
              }
            }
            currentChunk += sentence + '. ';
          }
        } else {
          currentChunk = paragraph;
        }
      } else {
        currentChunk += '\n\n' + paragraph;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  /**
   * Remove duplicates by name (case-insensitive)
   * @param {Array} items - Array of items with 'name' property
   * @returns {Array} Deduplicated array
   */
  deduplicateByName(items) {
    const seen = new Set();
    return items.filter(item => {
      const normalizedName = item.name?.toLowerCase().trim();
      if (!normalizedName || seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });
  }
}

module.exports = new ExtractionService();


