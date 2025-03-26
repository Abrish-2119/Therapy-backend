const mongoose = require("mongoose");

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "counselor" },
});

// Check if the model already exists before defining it
const Counselor =
  mongoose.models.Counselor || mongoose.model("Counselor", counselorSchema);

module.exports = Counselor;
