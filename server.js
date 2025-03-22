const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');  // You missed requiring mongoose
const connectDB = require('./db');
const contactRoutes = require('./routes/Contact');

dotenv.config();
const app = express();

// MongoDB connection
connectDB();
mongoose.set('strictQuery', true);  // To suppress the warning

// ✅ CORS Configuration
const allowedOrigins = [
  'https://jainam-website1.netlify.app',   // Your Netlify frontend
  'http://localhost:3000'                  // For local testing (optional)
];

app.use(cors({
  origin: allowedOrigins,          // Allow only specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
