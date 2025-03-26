const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  subject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
