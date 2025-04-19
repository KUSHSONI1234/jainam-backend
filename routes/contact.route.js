const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST: Save contact form data
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
