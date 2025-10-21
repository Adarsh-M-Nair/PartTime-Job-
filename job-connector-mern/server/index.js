const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: './.env' });

// Debug environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Connect to Database
connectDB();

const app = express();

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your React frontend access
    credentials: true,
})); 
app.use(express.json()); // Body parser for raw JSON data

// --- Import and Define Routes ---
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Simple root route
app.get('/', (req, res) => {
    res.send('Job Connector API is running...');
});

// Fallback for 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));