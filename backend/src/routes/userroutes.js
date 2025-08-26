import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// This route handles both GET (to fetch) and PUT (to update) requests
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;