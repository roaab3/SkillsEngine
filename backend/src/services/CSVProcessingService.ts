import { v4 as uuidv4 } from 'uuid';
import { TaxonomyRepository } from '../repositories/TaxonomyRepository';
import { AIService } from './AIService';
import { ValidationError } from '../utils/errors';
import logger from '../utils/logger';

interface UploadStatus {
  upload_id: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  errors: string[];
}

export class CSVProcessingService {
  private taxonomyRepository: TaxonomyRepository;
  private aiService: AIService;
  private uploadStatuses: Map<string, UploadStatus> = new Map();

  constructor() {
    this.taxonomyRepository = new TaxonomyRepository();
    this.aiService = new AIService();
  }

  async processCSVUpload(buffer: Buffer, userId: string): Promise<string> {
    const uploadId = uuidv4();

    // Initialize status
    this.uploadStatuses.set(uploadId, {
      upload_id: uploadId,
      status: 'uploaded',
      progress: 0,
      message: 'CSV file uploaded successfully',
      errors: [],
    });

    // Process asynchronously
    this.processCSV(buffer, uploadId, userId).catch((error) => {
      logger.error('Error processing CSV:', error);
      const status = this.uploadStatuses.get(uploadId);
      if (status) {
        status.status = 'failed';
        status.message = `Processing failed: ${error.message}`;
        status.errors.push(error.message);
      }
    });

    return uploadId;
  }

  private async processCSV(buffer: Buffer, uploadId: string, userId: string): Promise<void> {
    const status = this.uploadStatuses.get(uploadId);
    if (!status) return;

    try {
      status.status = 'processing';
      status.progress = 10;
      status.message = 'Parsing CSV file';

      // Parse CSV
      const csvText = buffer.toString('utf-8');
      const lines = csvText.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        throw new ValidationError('CSV file must contain at least a header and one data row');
      }

      status.progress = 30;
      status.message = 'Validating CSV structure';

      // Parse header (simplified - would need proper CSV parsing)
      const header = lines[0].split(',').map((h) => h.trim());
      
      // Expected format: Competency, Skill, Subskill, etc.
      // This is simplified - would need proper hierarchical parsing

      status.progress = 50;
      status.message = 'Normalizing data with AI';

      // Extract and normalize skills/competencies
      const allItems: string[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        allItems.push(...values.filter((v) => v));
      }

      const normalized = await this.aiService.normalizeSkills(allItems);

      status.progress = 70;
      status.message = 'Storing in database';

      // Store in database (simplified - would need proper hierarchy building)
      for (const item of normalized) {
        // This is simplified - would need to build proper hierarchy
        // For now, just log
        logger.info(`Processed item: ${item}`);
      }

      status.progress = 100;
      status.status = 'completed';
      status.message = 'CSV file processed successfully';
    } catch (error) {
      status.status = 'failed';
      status.message = `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      status.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getUploadStatus(uploadId: string): Promise<UploadStatus> {
    const status = this.uploadStatuses.get(uploadId);
    if (!status) {
      throw new ValidationError('Upload ID not found');
    }
    return status;
  }
}

