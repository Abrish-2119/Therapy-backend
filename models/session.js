const mongoose = require("mongoose");

// Session Schema
const sessionSchema = new mongoose.Schema(
  {
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > new Date(); // Ensure that the session is scheduled for the future
        },
        message: "Session must be scheduled in the future",
      },
    },
    duration: {
      type: Number,
      required: true,
      min: 30,
      max: 120, // Session duration must be between 30 minutes and 2 hours
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending", // Default status is 'pending'
    },
    meetingLink: {
      type: String,
      default: null, // URL for virtual sessions (could be used for video/audio calls)
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);

// Pre-save hook for conflict checking
sessionSchema.pre("save", async function (next) {
  // Check for overlapping sessions with the same counselor
  const conflict = await this.constructor.findOne({
    counselorId: this.counselorId,
    date: {
      $gte: new Date(this.date.getTime() - this.duration * 60000),
      $lte: new Date(this.date.getTime() + this.duration * 60000),
    },
    status: { $nin: ["cancelled", "completed"] }, // Ignore cancelled or completed sessions
  });

  if (conflict) {
    throw new Error(`Counselor already has a session at ${conflict.date}`);
  }
  next(); // Proceed if no conflict is found
});

// Export the model
module.exports = mongoose.model("Session", sessionSchema);
