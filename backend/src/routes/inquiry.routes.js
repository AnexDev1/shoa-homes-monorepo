import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  markInquiryAsRead,
} from '../controllers/inquiry.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', createInquiry);

// Protected routes (admin only)
router.get('/', authenticate, getAllInquiries);
router.patch('/:id/read', authenticate, markInquiryAsRead);

export default router;
