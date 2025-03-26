const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the model already exists before defining it
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

module.exports = Client;
