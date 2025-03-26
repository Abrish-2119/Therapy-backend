const Feedback = require("../models/feedback");

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { sessionId, clientId, rating, comments } = req.body;

    if (!sessionId || !clientId || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({ sessionId, clientId, rating, comments });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all feedback
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("sessionId clientId");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { createFeedback, getFeedbacks };
