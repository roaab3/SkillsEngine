/**
 * Official Source Repository
 *
 * Data access layer for official_sources table.
 * Uses Supabase client for database operations.
 */

const { getSupabaseClient } = require('../../config/supabase');
const OfficialSource = require('../models/OfficialSource');

class OfficialSourceRepository {
  constructor() {
    this.supabase = null;
  }

  /**
   * Get Supabase client instance
   */
  getClient() {
    if (!this.supabase) {
      this.supabase = getSupabaseClient();
    }
    return this.supabase;
  }

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

    const { data, error } = await this.getClient()
      .from('official_sources')
      .upsert({
        source_id: source.source_id,
        source_name: source.source_name,
        reference_index_url: source.reference_index_url,
        reference_type: source.reference_type,
        hierarchy_support: source.hierarchy_support,
        provides: source.provides,
        topics_covered: source.topics_covered,
        skill_focus: source.skill_focus,
        notes: source.notes,
        last_checked: source.last_checked,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'source_id'
      })
      .select()
      .single();

    if (error) throw error;
    return new OfficialSource(data);
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
    const { data, error } = await this.getClient()
      .from('official_sources')
      .select('source_id, reference_index_url');

    if (error) throw error;
    return data;
  }
}

module.exports = new OfficialSourceRepository();


