// 1. Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const expressSession = require('express-session');

// Load environment variables
require('dotenv').config();

// Import models
const Signup = require('../models/Signup');

// 2. Instantiations
const app = express();
const PORT = process.env.PORT || 3008;

// Import routes
const saleRoutes = require('../routes/saleRoutes');
const productRoutes = require('../routes/productRoutes');
const creditRoutes = require('../routes/creditRoutes');
const authRoutes = require('../routes/authRoutes');
const managerMatuggaRoutes = require('../routes/managerMatuggaRoutes');
const directorRoutes = require('../routes/directorRoutes');
const salesAgentMatuggaRoutes = require('../routes/salesAgentMatuggaRoutes');
const homeRoutes = require('../routes/homeRoutes');
const salesHistoryRoutes = require('../routes/salesHistoryRoutes');
const creditRecordRoutes = require('../routes/creditRecordRoutes');
const salesPerProductRoutes = require('../routes/salesPerProductRoutes');
const managerMaganjoRoutes = require('../routes/managerMaganjoRoutes');
const salesAgentMaganjoRoutes = require('../routes/salesAgentMaganjoRoutes');

// 3. Mongoose Configuration
const databaseUri = process.env.DATABASE;

if (databaseUri) {
  mongoose
    .connect(databaseUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000
    })
    .then(() => {
      console.log('Mongoose connection open');
    })
    .catch((err) => {
      console.log(`Connection error: ${err.message}`);
    });

  mongoose.connection.on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });
} else {
  console.log('DATABASE environment variable is not set. Running without MongoDB connection.');
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// 4. Express Configuration
app.locals.moment = moment;

// 5. Middleware Configuration
const sessionConfig = expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Express session & passport setup
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(Signup.createStrategy());
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());

// 6. Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('/', saleRoutes);
app.use('/', productRoutes);
app.use('/', creditRoutes);
app.use('/', authRoutes);
app.use('/', directorRoutes);
app.use('/', managerMatuggaRoutes);
app.use('/', salesAgentMatuggaRoutes);
app.use('/', homeRoutes);
app.use('/', salesHistoryRoutes);
app.use('/', creditRecordRoutes);
app.use('/', salesPerProductRoutes);
app.use('/', managerMaganjoRoutes);
app.use('/', salesAgentMaganjoRoutes);

// 7. 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// 8. Error handling for routes
app.use((err, req, res, next) => {
  console.error('=== ERROR DETAILS ===');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Message:', err.message);
  console.error('Status:', err.status);
  console.error('Stack:', err.stack);
  console.error('====================');
  
  res.status(err.status || 500).json({ 
    error: 'Something broke!',
    message: err.message,
    path: req.path,
    method: req.method,
    status: err.status || 500
  });
});

// Bootstrapping local server only. Vercel invokes the exported app directly.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
