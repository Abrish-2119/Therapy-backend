const express = require("express");
const {
  signup,
  login,
  adminSignup,
  clientSignup,
  counselorSignup,
  switchRole,
} = require("../controllers/authController");
const router = express.Router();

// Regular user signup route
router.post("/signup", signup);

// Client signup route (Separate logic for client signup)
router.post("/client/signup", clientSignup);

// Counselor signup route (Separate logic for counselor signup)
router.post("/counselor/signup", counselorSignup);

// Admin signup route (Separate logic for admin signup)
router.post("/admin/signup", adminSignup);

// Login route (login for client, counselor, admin)
router.post("/login", login);
router.patch("/role/switch", switchRole);
module.exports = router;
