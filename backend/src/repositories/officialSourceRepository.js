/**
 * Official Source Repository
 *
 * Data access layer for official_sources table.
 */

const { query } = require('../../config/database');
const OfficialSource = require('../models/OfficialSource');

class OfficialSourceRepository {
  /**
   * Upsert a single official source by source_id
   * @param {OfficialSource} source
   * @returns {Promise<OfficialSource>}
   */
  async upsert(source) {
    const validation = source.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const sql = `
      INSERT INTO official_sources (
        source_id,
        source_name,
        reference_index_url,
        reference_type,
        hierarchy_support,
        provides,
        topics_covered,
        skill_focus,
        notes,
        last_checked
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (source_id) DO UPDATE SET
        source_name = EXCLUDED.source_name,
        reference_index_url = EXCLUDED.reference_index_url,
        reference_type = EXCLUDED.reference_type,
        hierarchy_support = EXCLUDED.hierarchy_support,
        provides = EXCLUDED.provides,
        topics_covered = EXCLUDED.topics_covered,
        skill_focus = EXCLUDED.skill_focus,
        notes = EXCLUDED.notes,
        last_checked = EXCLUDED.last_checked,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      source.source_id,
      source.source_name,
      source.reference_index_url,
      source.reference_type,
      source.hierarchy_support,
      source.provides,
      source.topics_covered,
      source.skill_focus,
      source.notes,
      source.last_checked,
    ];

    const result = await query(sql, values);
    return new OfficialSource(result.rows[0]);
  }

  /**
   * Bulk upsert helper
   * @param {OfficialSource[]} sources
   * @returns {Promise<OfficialSource[]>}
   */
  async bulkUpsert(sources) {
    const saved = [];
    for (const source of sources) {
      const savedSource = await this.upsert(source);
      saved.push(savedSource);
    }
    return saved;
  }

  /**
   * Get minimal view of all existing sources (for de-duplication)
   * @returns {Promise<Array<{source_id: string, reference_index_url: string}>>}
   */
  async findAllMinimal() {
    const sql = `
      SELECT source_id, reference_index_url
      FROM official_sources
    `;
    const result = await query(sql);
    return result.rows;
  }
}

module.exports = new OfficialSourceRepository();


