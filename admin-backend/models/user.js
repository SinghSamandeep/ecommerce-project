const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  emailId: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "editor", "support"],
    default: "support", // Default role is 'support'
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
