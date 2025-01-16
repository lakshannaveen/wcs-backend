const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Pool } = require('pg');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

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



// Default Route for Health Check
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
