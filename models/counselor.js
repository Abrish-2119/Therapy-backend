const mongoose = require("mongoose");

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialties: { type: [String], required: true },
  qualifications: { type: String },
  password: { type: String, required: true },

  license: {
    number: { type: String, required: true },
    expiry: { type: Date, required: true },
    verification: {
      status: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected"],
        default: "unverified",
      },
      verifiedAt: Date,
      rejectionReason: String,
    },
  },
});

module.exports = mongoose.model("Counselor", counselorSchema);
