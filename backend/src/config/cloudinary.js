import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the backend directory
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Verify Cloudinary configuration — we only check presence of all required env vars.
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);
if (!isConfigured) {
  console.warn(
    'Cloudinary is not configured: missing one or more CLOUDINARY_* env vars. Development fallback will be used.'
  );
}

// Cloudinary configuration is valid, proceed with initialization

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  // Log only the configured cloud name (not the key/secret) so developers can confirm the target
  console.info(
    `Cloudinary configured for cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`
  );
} else {
  console.info(
    'Cloudinary not configured — using data-uri placeholder fallback for uploads.'
  );
}

export const uploadToCloudinary = async (file, folder = 'shoa-homes') => {
  try {
    // If Cloudinary is not configured properly (development), skip uploading and return placeholder
    if (!isConfigured) {
      console.warn(
        'Cloudinary is not configured correctly, using placeholder image for uploads'
      );
      // Inline SVG placeholder (data URI) to avoid external network calls
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='24'>No Image Available</text></svg>`;
      const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      return {
        url: dataUri,
        publicId: `placeholder_${Date.now()}`,
      };
    }
    // Normalize the file path for Windows
    const normalizedPath = file.tempFilePath.replace(/\\/g, '/');

    // Use the normalized temp file path for upload
    const result = await cloudinary.uploader.upload(normalizedPath, {
      folder,
      resource_type: 'auto',
    });

    // Return the result in a simple shape expected by controllers
    return {
      url: result.secure_url,
      publicId: result.public_id,
      raw: result,
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Silently handle delete errors
  }
};

export default cloudinary;
