const express = require("express");
const {
  getMatches,
  getMatchHistory,
} = require("../controllers/matchingController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateMatchingPreferences,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Real-time matching (POST request)
router.post(
  "/matches",
  authMiddleware, // Ensure the user is authenticated
  validateMatchingPreferences, // Apply the validation middleware
  getMatches // Controller that handles the matching logic
);

// Match history (GET request)
router.get("/matches/history", authMiddleware, getMatchHistory);

module.exports = router; // Export the router
