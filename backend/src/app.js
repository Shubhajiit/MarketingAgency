const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const workshopRoutes = require('./routes/workshop.routes');
const courseRoutes = require('./routes/course.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');

const path = require('path');

const app = express();

// Rate limiter for payment endpoints (100 req / 15 min per IP)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again after 15 minutes.' },
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://aiscallex.vercel.app',
    'https://aiscallex.in',
    'https://www.aiscallex.in',
    'https://aiscallex.com/',
    'https://www.aiscallex.com/',
    process.env.CLIENT_URL,
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : [])
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/workshops', workshopRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentLimiter, paymentRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running'
  });
});

module.exports = app;

module.exports = app;
