import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
} from '../controllers/property.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes (require authentication)
// All property management endpoints require ADMIN role
router.post('/', authenticate, authorize(['ADMIN']), createProperty);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProperty);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProperty);
router.post(
  '/:id/images',
  authenticate,
  authorize(['ADMIN']),
  uploadPropertyImages
);

export default router;
