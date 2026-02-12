// Testimonial controller removed (feature temporarily disabled).
// File retained as a stub to avoid accidental imports.

export const getPublished = async (req, res) =>
  res.status(404).json({ message: 'Feature disabled' });
export const adminGetAll = async (req, res) =>
  res.status(404).json({ message: 'Feature disabled' });
export const create = async (req, res) =>
  res.status(404).json({ message: 'Feature disabled' });
export const update = async (req, res) =>
  res.status(404).json({ message: 'Feature disabled' });
export const deleteTestimonial = async (req, res) =>
  res.status(404).json({ message: 'Feature disabled' });

export default {
  getPublished,
  adminGetAll,
  create,
  update,
  delete: deleteTestimonial,
};
