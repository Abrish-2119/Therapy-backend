const express = require("express");
const {
  signupCounselor,
  signupClient,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Sign Up Routes
router.post("/counselor/signup", signupCounselor); // Register counselor
router.post("/client/signup", signupClient); // Register client

// Login Route
router.post("/login", login); // Login route for both counselor and client

module.exports = router;
