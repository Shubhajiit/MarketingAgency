const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://scaleai-ashy.vercel.app', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

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
