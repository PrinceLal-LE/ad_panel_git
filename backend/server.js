// server.js (Main Application Entry Point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Import helmet
const rateLimit = require('express-rate-limit'); // For basic rate limiting
require('dotenv').config(); // Load environment variables from .env file

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const dataRoutes = require('./routes/dataRoutes'); // Re-enable import for dataRoutes

const { initializeRoles } = require('./models/Roles'); // Import the role initialization function

let DataItem; // Declare DataItem here, but assign it after mongoose connection

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel_db';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this is also loaded from .env

// --- NEW DEBUGGING MIDDLEWARE ---
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});
// --- END NEW DEBUGGING MIDDLEWARE ---


// --- Security Middleware ---
app.use(cors({
    origin: [
        'http://localhost:5001',   // Vite frontend
        'http://127.0.0.1:5001',   // Sometimes browsers send requests with 127.0.0.1
        'https://admin.mouldconnect.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(helmet()); 

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter); // Apply to all API routes

// JSON Body Parser
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        initializeRoles(); // Initialize roles after successful DB connection

        // --- NEW: Require DataItem model AFTER successful MongoDB connection ---
        DataItem = require('./models/DataItem');
        console.log('DataItem required AFTER MongoDB connection:', DataItem); // NEW: Log after requiring
        console.log('Mongoose models after DataItem require:', mongoose.models); // NEW: Check all registered models
        // --- END NEW ---

    })
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---

// Public routes (do NOT require authentication)
app.use('/api', publicRoutes);

// Authentication routes (e.g., /api/auth/register, /api/auth/login)
app.use('/api/auth', authRoutes);

// Admin/Protected routes (e.g., /api/admin/superadmin-data)
app.use('/api/admin', adminRoutes);

// Data CRUD routes (e.g., /api/data)
// This will now use the DataItem model which is required after MongoDB connection.
app.use('/api/data', dataRoutes); // Re-enabled the original dataRoutes mounting

// Basic route for testing server status
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Admin Panel Backend is running!' });
});

// --- Error Handling Middleware (should be last) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
