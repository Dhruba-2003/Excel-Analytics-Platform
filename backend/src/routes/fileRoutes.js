import express from 'express';
import { 
  upload, 
  uploadFile, 
  getFileById, 
  saveAnalysis, 
  getUserFiles 
} from '../controllers/fileController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUserFiles);

router.route('/upload').post(protect, upload.single('excelFile'), uploadFile);
router.route('/:id').get(protect, getFileById);
router.route('/:id/analysis').post(protect, saveAnalysis);

export default router;