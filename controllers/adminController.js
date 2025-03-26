const User = require("../models/user");
const Session = require("../models/session");
const Feedback = require("../models/feedback");

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt"); // Explicitly select necessary fields
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Sessions (Admin Only)
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate(
      "counselorId clientId",
      "name email"
    );

    if (!sessions.length) {
      return res.status(404).json({ message: "No sessions found" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Feedback (Admin Only)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate(
      "sessionId clientId",
      "name email"
    );

    if (!feedbacks.length) {
      return res.status(404).json({ message: "No feedbacks found" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getUsers, getSessions, getFeedbacks };
