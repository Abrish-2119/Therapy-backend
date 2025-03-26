const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferences: { type: Object },
  sessionHistory: { type: [mongoose.Schema.Types.ObjectId], ref: "Session" },
});

module.exports = mongoose.model("Client", clientSchema);
