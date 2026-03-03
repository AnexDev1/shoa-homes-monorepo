import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the backend directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const storageProvider = (process.env.STORAGE_PROVIDER || 'local')
  .toLowerCase()
  .trim();

// Verify Cloudinary configuration — we only check presence of all required env vars.
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);
if (storageProvider === 'cloudinary' && !isConfigured) {
  console.warn(
    'STORAGE_PROVIDER=cloudinary but Cloudinary is not configured. Falling back to local storage.'
  );
}

const useCloudinary = storageProvider === 'cloudinary' && isConfigured;

// Cloudinary configuration is valid and explicitly enabled, proceed with initialization

if (useCloudinary) {
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
    `Using local storage for uploads (STORAGE_PROVIDER=${storageProvider || 'local'}).`
  );
}

import fs from 'fs';
import crypto from 'crypto';

export const uploadToCloudinary = async (file, folder = 'shoa-homes') => {
  try {
    const useLocal = !useCloudinary;

    // Compute uploads base dir (backend/uploads by default)
    const uploadsBase =
      process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
    const targetFolder = path.join(uploadsBase, folder);

    // Ensure upload directory exists
    fs.mkdirSync(targetFolder, { recursive: true });

    // If using local storage, move the uploaded temp file into our uploads area and return a URL
    if (useLocal) {
      try {
        // Source temp path provided by express-fileupload
        const srcPath = (file.tempFilePath || file.path || '').replace(
          /\\/g,
          '/'
        );
        if (!srcPath) {
          throw new Error('Missing temporary upload path');
        }
        const originalName = file.name || path.basename(srcPath);
        const randomSuffix = crypto.randomBytes(6).toString('hex');
        const safeName = `${Date.now()}-${randomSuffix}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const destPath = path.join(targetFolder, safeName);

        // Move temp file to destination (fallback to copy/unlink for cross-device moves)
        try {
          fs.renameSync(srcPath, destPath);
        } catch (moveError) {
          if (moveError?.code === 'EXDEV') {
            fs.copyFileSync(srcPath, destPath);
            fs.unlinkSync(srcPath);
          } else {
            throw moveError;
          }
        }

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
    const useLocal = !useCloudinary;
    if (useLocal) {
      // publicId for local files is stored as folder/filename
      const uploadsBase =
        process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
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
