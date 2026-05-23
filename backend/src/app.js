const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { env } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/apiResponse');

// Import routes
const authRoutes = require('./routes/auth.routes');
const workshopRoutes = require('./routes/workshop.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const videoRoutes = require('./routes/video.routes');
const userRoutes = require('./routes/user.routes');
const webhookRoutes = require('./routes/webhook.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ─── Security ───────────────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────
const allowedOrigins = env.FRONTEND_URL.split(',').map(url => url.trim());

// Handle preflight for all routes
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Logging ────────────────────────────────────────────────
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// ─── Cookie parser ──────────────────────────────────────────
app.use(cookieParser());

// ─── Webhook routes — MUST be before express.json() ─────────
// Webhooks need raw body for signature verification
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// ─── Body parsing (for all other routes) ────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Global rate limiter ────────────────────────────────────
app.use(rateLimiter({ windowMs: 60000, max: 100, prefix: 'global-rate' }));

// ─── Root Route ─────────────────────────────────────────────
app.get('/', (req, res) => {
  ApiResponse.success(res, {
    name: 'AI Scale API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  }, 'Welcome to the AI Scale API');
});

// ─── Health check ───────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  ApiResponse.success(res, {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }, 'Server is healthy');
});

// ─── API Routes ─────────────────────────────────────────────
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/workshops', workshopRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/videos', videoRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/admin', adminRoutes);

// Standard API path
app.use('/api/v1', apiRouter);

// Fallback: Vercel serverless strips /api prefix from req.url when serving from api/index.js
// So /api/v1/auth/login arrives as /v1/auth/login
app.use('/v1', apiRouter);

// ─── 404 handler ────────────────────────────────────────────
app.use('*', (req, res) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
});

// ─── Global error handler (must be last) ────────────────────
app.use(errorHandler);

module.exports = app;
