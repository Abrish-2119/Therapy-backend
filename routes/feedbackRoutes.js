const express = require("express");
const {
  createFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");

const router = express.Router();

// POST feedback
router.post("/", createFeedback);

// GET all feedback
router.get("/", getFeedbacks);

module.exports = router;
