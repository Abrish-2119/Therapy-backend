// models/matching.js
const mongoose = require("mongoose");

const matchingSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counselor",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  matchedOn: {
    type: Date,
    default: Date.now,
  },
  // Additional matching criteria
  matchingCriteria: {
    specialties: [String],
    availability: [String],
    languages: [String],
  },
});

// Index for faster queries
matchingSchema.index({ clientId: 1, counselorId: 1 }, { unique: true });

module.exports = mongoose.model("Matching", matchingSchema);
