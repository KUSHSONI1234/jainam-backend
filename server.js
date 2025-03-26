const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// 🔥 CORS Configuration
const allowedOrigins = [
  'http://localhost:4200',                       // Local Angular frontend
  'https://jainam-website.netlify.app'           // Deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Routes
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
