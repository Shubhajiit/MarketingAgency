const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const workshopRoutes = require('./routes/workshop.routes');

const path = require('path');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://scaleai-ashy.vercel.app', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/workshops', workshopRoutes);

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
