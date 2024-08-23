const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  notifications: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    }
  ],
});

module.exports = mongoose.model("Admin", adminSchema);