// Utility to resolve image URLs for local vs production environments
export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's a Cloudinary URL, return as-is
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // For local URLs, prepend the API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path starting with /uploads, prepend API base (but strip /api suffix)
  if (imageUrl.startsWith('/uploads')) {
    let baseUrl = API_BASE;
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.slice(0, -4); // Remove trailing /api
    }
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1); // Remove trailing slash
    }
    return `${baseUrl}${imageUrl}`;
  }

  return imageUrl;
};
