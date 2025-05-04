const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoute');
const changePasswordRoute= require('./routes/changePasswordRoute.js')
const checkoutRoutes = require("./routes/checkoutRoutes");
const emailRoutes = require('./routes/emailRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

require('./controllers/cron/updatePendingCollectionTimes');
require('./controllers/cron/updateCollectionStatus'); 




// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on your frontend domain
  credentials: true, // Allow cookies to be sent
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());  // Added cookieParser middleware if you're working with cookies

// Ensure required environment variables are set
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1); // Exit if any required environment variables are missing
}

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Enable SSL for production
});

// Test DB connection
pool.connect()
    .then(() => console.log('✅ Database connected successfully'))
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
        process.exit(1); // Exit the app if the database connection fails
    });

// Attach the pool to app locals for use in routes
app.locals.pool = pool;
// contact Routes
app.use('/api/contact', contactRoutes);
// Register routes
app.use('/api/users', userRoutes); 
// feedbackRoutes
app.use('/api/feedback', feedbackRoutes);
// Admin Routes
app.use('/api/admin', adminRoutes);
// passowrd change route
app.use('/api/password', changePasswordRoute);
//email routes
app.use('/api/email', emailRoutes);
//checout toute
app.use("/api/checkout", checkoutRoutes);
// Stripe Routes
app.use('/api/payment', stripeRoutes);
app.get('/', (req, res) => {
    res.status(200).send('Waste Collection System Backend is Running');
});

// Handle 404 Errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
