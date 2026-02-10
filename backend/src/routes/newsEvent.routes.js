import express from 'express';
import newsEventController from '../controllers/newsEvent.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin routes (require authentication)
router.get('/admin', authenticate, newsEventController.adminGetAll);
router.post('/', authenticate, newsEventController.create);
router.put('/:id', authenticate, newsEventController.update);
router.delete('/:id', authenticate, newsEventController.delete);

// Public routes
router.get('/', newsEventController.getPublished);
router.get('/:id', newsEventController.getById);

export default router;
