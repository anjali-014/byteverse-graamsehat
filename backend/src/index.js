import dotenv from 'dotenv';
dotenv.config(); // MUST BE FIRST

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import axios from 'axios';

import { checkDbConnection } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import syncRoutes from './routes/sync.js';
import dashboardRoutes from './routes/dashboard.js';
import facilitiesRoutes from './routes/facilities.js';
import ashaRoutes from './routes/asha.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ================= MIDDLEWARE =================
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));

// ================= BASIC ROUTES =================
app.get('/', (req, res) => {
  res.send("Backend is LIVE 🚀");
});

app.get('/test', (req, res) => {
  res.send("TEST WORKING");
});

app.get('/api/ping', (_req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

// ================= API ROUTES =================
app.use('/api/sync', syncRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/asha', ashaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

// ================= ML ROUTE =================
app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ML_URL}/predict`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("ML ERROR:", err.message);
    res.status(500).json({
      error: "ML service failed",
      details: err.message
    });
  }
});

// ================= 404 =================
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER START =================
let server;

function shutdown(signal) {
  console.log(`[Server] ${signal} received — shutting down gracefully`);
  if (server) {
    server.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });
  }
  setTimeout(() => {
    console.error('[Server] Force exit after timeout');
    process.exit(1);
  }, 10000);
}

async function start() {
  try {
    // DB connection (safe)
    try {
      await checkDbConnection();
      console.log("[DB] Connected successfully");
    } catch (err) {
      console.log("⚠️ DB failed, continuing without DB:", err.message);
    }

    // Start server
    if (!server) {
      server = app.listen(PORT, () => {
        console.log(`[Server] GraamSehat backend running on port ${PORT}`);
        console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('[Server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();

export default app;