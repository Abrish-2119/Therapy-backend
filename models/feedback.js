const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
