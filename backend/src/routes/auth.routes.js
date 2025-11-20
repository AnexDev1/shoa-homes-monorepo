import express from 'express';
import {
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
// Registration disabled — admin accounts are pre-provisioned
router.post('/login', login);

// Protected routes
router.use(authenticate);
router.get('/me', getCurrentUser);
router.put('/me', updateProfile);
router.put('/change-password', changePassword);

export default router;
