import { pool } from '../config/database';
import { OfficialSource } from '../types';
import { DatabaseError } from '../utils/errors';
import logger from '../utils/logger';

export class SourceRepository {
  async getOfficialSources(): Promise<OfficialSource[]> {
    try {
      const result = await pool.query('SELECT * FROM official_sources ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      logger.error('Error getting official sources:', error);
      throw new DatabaseError('Failed to get official sources', error as Error);
    }
  }

  async getOfficialSourceById(sourceId: string): Promise<OfficialSource | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM official_sources WHERE source_id = $1',
        [sourceId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting official source by ID:', error);
      throw new DatabaseError('Failed to get official source', error as Error);
    }
  }

  async addOfficialSource(source: OfficialSource): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO official_sources (
          source_id, source_name, reference_index_url, reference_type,
          access_method, hierarchy_support, provides, topics_covered,
          skill_focus, notes, last_checked
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (source_id) DO UPDATE SET
          source_name = EXCLUDED.source_name,
          reference_index_url = EXCLUDED.reference_index_url,
          reference_type = EXCLUDED.reference_type,
          access_method = EXCLUDED.access_method,
          hierarchy_support = EXCLUDED.hierarchy_support,
          provides = EXCLUDED.provides,
          topics_covered = EXCLUDED.topics_covered,
          skill_focus = EXCLUDED.skill_focus,
          notes = EXCLUDED.notes,
          last_checked = EXCLUDED.last_checked`,
        [
          source.source_id,
          source.source_name,
          source.reference_index_url,
          source.reference_type,
          source.access_method,
          source.hierarchy_support,
          source.provides,
          source.topics_covered,
          source.skill_focus,
          source.notes,
          source.last_checked,
        ]
      );
    } catch (error) {
      logger.error('Error adding official source:', error);
      throw new DatabaseError('Failed to add official source', error as Error);
    }
  }

  async updateSourceLastChecked(sourceId: string): Promise<void> {
    try {
      await pool.query(
        'UPDATE official_sources SET last_checked = CURRENT_TIMESTAMP WHERE source_id = $1',
        [sourceId]
      );
    } catch (error) {
      logger.error('Error updating source last checked:', error);
      throw new DatabaseError('Failed to update source last checked', error as Error);
    }
  }

  async getSourcesByType(referenceType: string): Promise<OfficialSource[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM official_sources WHERE reference_type = $1',
        [referenceType]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting sources by type:', error);
      throw new DatabaseError('Failed to get sources by type', error as Error);
    }
  }
}

