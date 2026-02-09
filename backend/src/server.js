import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userRoutes from './routes/user.routes.js';
import agentRoutes from './routes/agent.routes.js';
import contactRoutes from './routes/contact.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (() => {
  const origins = [
    'http://localhost:3000', // Local development (legacy)
    'http://localhost:5173', // Vite dev server
    'https://shoa-0vtw.onrender.com', // legacy frontend domain
    'https://shoahomes.com', // Production domain
    'https://www.shoahomes.com', // Production domain with www
  ];
  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
  return new Set(origins.filter(Boolean));
})();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  fileUpload({
    useTempFiles: true,
    // Use OS temporary directory which works cross-platform
    tempFileDir: os.tmpdir(),
    preserveExtension: true,
    // Increased limits for larger images
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    // Increase timeout for large file processing
    uploadTimeout: 60000, // 60 seconds
  })
);

// Ensure persistent uploads directory exists and serve it at /uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir =
  process.env.UPLOADS_DIR || path.resolve(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
// Avoid noisy console logs in production — use console.info only for critical messages
if (process.env.NODE_ENV !== 'production') {
  console.info(`Serving uploads from ${uploadsDir} at /uploads`);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
// Inquiries removed — contact via phone/email
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shoa Homes API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Ensure CORS header is present on error responses so browser can read them
  try {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  } catch (e) {
    // ignore header set errors
  }

  // Special handling for payload too large
  if (err?.status === 413 || err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Uploaded file is too large. Maximum allowed size is 50MB.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(
    `🌐 CORS allowed origins: ${JSON.stringify(Array.from(allowedOrigins))}`
  );
});
