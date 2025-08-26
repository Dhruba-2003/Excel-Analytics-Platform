import express from 'express';
import { getUsers } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// This route is protected twice:
// 'protect' ensures the user is logged in.
// 'admin' ensures the logged-in user is an admin.
router.route('/users').get(protect, admin, getUsers);

export default router;