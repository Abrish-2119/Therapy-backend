const express = require("express");
const {
  getUsers,
  getSessions,
  getFeedbacks,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Protect admin routes
router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/sessions", authMiddleware, adminMiddleware, getSessions);
router.get("/feedbacks", authMiddleware, adminMiddleware, getFeedbacks);

module.exports = router;
