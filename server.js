const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const userRoutes = require('./routes/userRoutes'); 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cookieParser()); // Add cookie-parser to handle cookies
app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
        credentials: true, // Enable cookies or tokens for cross-origin requests
    })
);
app.use(helmet());
app.use(express.json());

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

// Register routes
app.use('/api/users', userRoutes); // Attach the user routes under the /api/users path

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
