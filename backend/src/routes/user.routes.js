import express from 'express';
import {
  createUser,
  getUsers,
  deleteUser,
  toggleAgentStatus,
  getAgentClients,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only admins can create, view, and delete users
router.post('/', authenticate, authorize(['ADMIN']), createUser);
router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);
router.patch(
  '/:id/status',
  authenticate,
  authorize(['ADMIN']),
  toggleAgentStatus
);

// Get clients by agent ID (accessible by admin or the agent themselves)
router.get(
  '/agents/:agentId/clients',
  authenticate,
  (req, res, next) => {
    // Allow access if user is admin or if the agentId matches the logged-in user's ID
    if (req.user.role === 'ADMIN' || req.user.id === req.params.agentId) {
      next();
    } else {
      res.status(403).json({ error: 'Not authorized to access this resource' });
    }
  },
  getAgentClients
);

export default router;
