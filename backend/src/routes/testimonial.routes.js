// Testimonial routes removed (feature temporarily disabled). File retained as a stub to avoid missing-import errors.
import express from 'express';
const router = express.Router();
router.get('/', (req, res) =>
  res.status(404).json({ message: 'Feature disabled' })
);
export default router;
