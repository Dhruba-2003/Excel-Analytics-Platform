import express from 'express';
import { getUsers } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.route('/users').get(protect, admin, getUsers);

export default router;