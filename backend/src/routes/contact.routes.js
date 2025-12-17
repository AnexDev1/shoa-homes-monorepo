import { Router } from 'express';
import {
  sendContactMessage,
  getContactInfo,
} from '../controllers/contact.controller.js';

const router = Router();

router.route('/').post(sendContactMessage).get(getContactInfo);

export default router;
