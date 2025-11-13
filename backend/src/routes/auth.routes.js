import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticate);
router.get('/me', getCurrentUser);
router.put('/me', updateProfile);
router.put('/change-password', changePassword);

export default router;
