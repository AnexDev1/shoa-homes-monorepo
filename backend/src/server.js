import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import os from 'os';

// Import routes
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local development (legacy)
      'http://localhost:5173', // Vite dev server
      'https://shoa-0vtw.onrender.com', // frontend domain
    ],
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
    // Optional limits (tune as needed)
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
// Inquiries removed — contact via phone/email
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shoa Homes API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
    `🌐 CORS allowed origins: ${JSON.stringify([
      'http://localhost:3000',
      'http://localhost:5173',
      'https://shoa-0vtw.onrender.com',
    ])}`
  );
});
