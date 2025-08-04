// 1. Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const moment =require('moment');
const expressSession = require('express-session');



// Load environment variables
require('dotenv').config();

// Import models
const Signup = require('./models/Signup');// Ensure this is the correct path

// 2. Instantiations
const app = express();
const PORT = 3008;

// Import routes
const saleRoutes= require('./routes/saleRoutes');
const productRoutes= require('./routes/productRoutes');
const creditRoutes = require('./routes/creditRoutes');
const authRoutes = require('./routes/authRoutes');
const managerMatuggaRoutes = require('./routes/managerMatuggaRoutes');
const directorRoutes = require('./routes/directorRoutes');
const salesAgentMatuggaRoutes = require('./routes/salesAgentMatuggaRoutes');
const homeRoutes = require('./routes/homeRoutes');
const salesHistoryRoutes=require('./routes/salesHistoryRoutes');
const creditRecordRoutes=require('./routes/creditRecordRoutes');
const salesPerProductRoutes=require('./routes/salesPerProductRoutes');
const managerMaganjoRoutes=require('./routes/managerMaganjoRoutes');
const salesAgentMaganjoRoutes=require('./routes/salesAgentMaganjoRoutes');
// //const stockRoutes = require('./routes/stockRoutes');

// 3. Mongoose Configuration
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
// 4. Express Configuration

  app.locals.moment=moment;

// 5. Middleware Configuration
const sessionConfig = expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Express session & passport setup
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(Signup.createStrategy()); 
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());

// 6. Routes
app.use('/', saleRoutes);
app.use('/',productRoutes);
app.use('/', creditRoutes);
app.use('/', authRoutes);
app.use('/', directorRoutes);
app.use('/', managerMatuggaRoutes);
app.use('/', salesAgentMatuggaRoutes);
app.use('/',homeRoutes);
app.use('/',salesHistoryRoutes),
app.use('/',creditRecordRoutes);
app.use('/',salesPerProductRoutes);
app.use('/',managerMaganjoRoutes);
app.use('/',salesAgentMaganjoRoutes);
//pp.use('/stock', stockRoutes);

// 7. Error handling for routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Bootstrapping the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
