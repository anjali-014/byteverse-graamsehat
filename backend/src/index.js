import dotenv from 'dotenv';
dotenv.config(); // MUST BE FIRST

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { checkDbConnection } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import syncRoutes from './routes/sync.js';
import dashboardRoutes from './routes/dashboard.js';
import facilitiesRoutes from './routes/facilities.js';
import ashaRoutes from './routes/asha.js';
import authRoutes from './routes/auth.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Security & logging middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Health check — used by frontend connectivity probe + Railway
app.get('/api/ping', (_req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

// Routes
app.use('/api/sync',       syncRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/asha',       ashaRoutes);
app.use('/api/auth',       authRoutes);
// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler — must be last
app.use(errorHandler);

// Graceful shutdown
function shutdown(signal) {
  console.log(`[Server] ${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[Server] Force exit after timeout');
    process.exit(1);
  }, 10000);
}

// Start server
let server;
async function start() {
  try {
    await checkDbConnection();
    server = app.listen(PORT, () => {
      console.log(`[Server] GraamSehat backend running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  } catch (err) {
    console.error('[Server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();

export default app;