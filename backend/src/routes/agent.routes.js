import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  addClient,
  getAgentClients,
  updateClient,
  deleteClient,
} from '../controllers/agent.controller.js';

const router = express.Router();

// Agent-specific routes
router.use(authenticate, authorize(['AGENT', 'ADMIN']));

// Client management routes
router.post('/clients', addClient);
router.get('/clients', getAgentClients);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

export default router;
