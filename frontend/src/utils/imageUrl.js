// Utility to resolve image URLs for local vs production environments
export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's a Cloudinary URL, return as-is
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // For local URLs, replace production domain with current API base
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const PRODUCTION_BASE = 'https://shoa-homes-backend.onrender.com';

  if (imageUrl.startsWith(PRODUCTION_BASE)) {
    return imageUrl.replace(PRODUCTION_BASE, API_BASE);
  }

  // If it's already a relative URL or matches current base, return as-is
  if (imageUrl.startsWith('/uploads') || imageUrl.startsWith(API_BASE)) {
    return imageUrl;
  }

  return imageUrl;
};
