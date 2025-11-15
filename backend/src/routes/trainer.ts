import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateUser, requireTrainer } from '../middleware/auth';
import { CSVProcessingService } from '../services/CSVProcessingService';
import { ValidationError } from '../utils/errors';

const router = Router();
const csvProcessingService = new CSVProcessingService();

// Configure multer for CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only CSV files are allowed'));
    }
  },
});

// Upload CSV
router.post(
  '/csv/upload',
  authenticateUser,
  requireTrainer,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ValidationError('CSV file is required');
    }

    const uploadId = await csvProcessingService.processCSVUpload(
      req.file.buffer,
      req.userId!
    );

    res.status(202).json({
      success: true,
      status: 'uploaded',
      upload_id: uploadId,
      message: 'CSV file uploaded successfully, queued for processing',
      timestamp: new Date().toISOString(),
    });
  })
);

// Get upload status
router.get(
  '/csv/status/:upload_id',
  authenticateUser,
  requireTrainer,
  asyncHandler(async (req, res) => {
    const { upload_id } = req.params;
    const status = await csvProcessingService.getUploadStatus(upload_id);

    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;

