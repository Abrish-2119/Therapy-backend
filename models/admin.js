const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two admins can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin", // Every admin has this role
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
