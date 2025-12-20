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

// Delete a single image from a property
router.delete(
  '/:id/images/:imageId',
  authenticate,
  authorize(['ADMIN']),
  // controller function implemented in property.controller.js
  // deletes image record and removes from Cloudinary/local storage
  // signature: deletePropertyImage(req, res)
  (req, res, next) => {
    import('../controllers/property.controller.js').then((mod) =>
      mod.deletePropertyImage(req, res, next)
    );
  }
);

export default router;
