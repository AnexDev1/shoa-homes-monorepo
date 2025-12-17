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

import fs from 'fs';
import os from 'os';

export const uploadToCloudinary = async (file, folder = 'shoa-homes') => {
  try {
    // Allow forcing local storage via STORAGE_PROVIDER=local or use local if Cloudinary isn't configured
    const useLocal = process.env.STORAGE_PROVIDER === 'local' || !isConfigured;

    // Compute uploads base dir (backend/uploads by default)
    const uploadsBase = process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
    const targetFolder = path.join(uploadsBase, folder);

    // Ensure upload directory exists
    fs.mkdirSync(targetFolder, { recursive: true });

    // If using local storage, move the uploaded temp file into our uploads area and return a URL
    if (useLocal) {
      try {
        // Source temp path provided by express-fileupload
        const srcPath = (file.tempFilePath || file.path || '').replace(/\\/g, '/');
        const originalName = file.name || path.basename(srcPath);
        const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const destPath = path.join(targetFolder, safeName);

        // Move temp file to destination
        fs.renameSync(srcPath, destPath);

        // Build a public URL for the file. If BACKEND_BASE_URL is set, use absolute URL; otherwise return a root-relative path.
        const base = process.env.BACKEND_BASE_URL
          ? process.env.BACKEND_BASE_URL.replace(/\/$/, '')
          : '';
        const url = base + `/uploads/${folder}/${safeName}`;

        return {
          url,
          publicId: `${folder}/${safeName}`,
          raw: { path: destPath },
        };
      } catch (err) {
        throw new Error(`Failed to save image locally: ${err.message}`);
      }
    }

    // Normalize the file path for Windows
    const normalizedPath = (file.tempFilePath || '').replace(/\\/g, '/');

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
    const useLocal = process.env.STORAGE_PROVIDER === 'local' || !isConfigured;
    if (useLocal) {
      // publicId for local files is stored as folder/filename
      const uploadsBase = process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
      const filePath = path.join(uploadsBase, publicId);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        // ignore local delete errors
      }
      return;
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Silently handle delete errors
  }
};

export default cloudinary;
