const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth');
const readingsRoutes = require('./routes/readings');
const usersRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/users', usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🔮 Tarot Reading Server`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✨ Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n✨ Shutting down gracefully...');
  process.exit(0);
});
