const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const bodyParser = require("body-parser");
const connectDB = require("./db");  // MongoDB connection
const contactRoutes = require("./routes/contact");  // Contact form routes
const adbHandler = require("./adbHandler");  // ADB handler

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// ADB Routes
// Route to connect and display device info
app.get("/connect", async (req, res) => {
  const result = adbHandler.connectDevice();
  res.send(result);
});

// Route to fetch images only
app.get("/images", async (req, res) => {
  try {
    const media = await adbHandler.fetchImages();
    
    if (media.success) {
      res.json(media.images);
    } else {
      res.status(500).send(media.message);
    }
  } catch (error) {
    res.status(500).send("Error fetching images");
  }
});

// Contact Form Routes
// Route to handle contact form submissions
app.use('/api/contact', contactRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
