#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  uploadToCloudinary,
  default as cloudinaryModule,
} from '../src/config/cloudinary.js';

// Load .env from repo root for config
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Usage: node scripts/testCloudinaryUpload.js <path-to-image>');
  process.exit(1);
}

const imagePath = path.resolve(args[0]);
if (!fs.existsSync(imagePath)) {
  console.error('File not found:', imagePath);
  process.exit(1);
}

(async () => {
  try {
    console.log('Starting Cloudinary test upload...');
    const file = { tempFilePath: imagePath };
    const result = await uploadToCloudinary(file, 'test_uploads');
    console.log('Upload result:');
    console.log('url:', result.url);
    console.log('publicId:', result.publicId);
    if (result.raw) {
      console.log('raw public_id:', result.raw.public_id);
    }
    console.log(
      'Done. If you see a secure URL above, Cloudinary uploads are working.'
    );
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    process.exit(2);
  }
})();
