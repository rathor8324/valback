require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Global request logger (useful for confirming route hits / diagnosing hangs).
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
const allowedOriginsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  // Only reflect back the origin we explicitly allow (needed for `credentials: true`)
  origin: (origin, callback) => {
    // Non-browser requests won't have an Origin header.
    if (!origin) return callback(null, true);

    // If the user configured explicit allowed origins, enforce that list.
    if (allowedOrigins.length > 0) {
      return callback(null, allowedOrigins.includes(origin));
    }

    // Safe default: allow GitHub Pages (and local dev) without falling back to `*`.
    const isGithubPages = /^https:\/\/([a-zA-Z0-9-]+\.)?github\.io$/.test(origin);
    const isLocalDev =
      origin === 'http://localhost:3000' ||
      origin === 'http://127.0.0.1:3000' ||
      origin === 'http://localhost:5173' ||
      origin === 'http://127.0.0.1:5173';

    return callback(null, isGithubPages || isLocalDev);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  // Some clients choke on 204; 200 is safer for production interop.
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled even when no route matches the OPTIONS method.
app.options('/{*splat}', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Routes
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
