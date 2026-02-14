const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { apiLimiter } = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/auth');
const salonRoutes = require('./routes/salons');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ReservCut API - Bienvenue',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/api/issa', (req, res) => {
  res.json({ message: 'issa bengassem' });
});


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});


app.listen(PORT, () => {
  console.log(`Serveur ReservCut API démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});



module.exports = app;


