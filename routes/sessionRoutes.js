const express = require("express");
const {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getCounselorSessions,
  getClientSessions,
  updateSessionStatus,
} = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a session (client books a session with a counselor)
router.post("/book", authMiddleware, createSession);

// Route to get all sessions (admin or all users)
router.get("/", authMiddleware, getAllSessions);

// Route to get a session by ID
router.get("/:id", authMiddleware, getSessionById);

// Route to update session (for both counselor and client)
router.put("/:id", authMiddleware, updateSession);

// Route to delete a session (for both counselor and client)
router.delete("/:id", authMiddleware, deleteSession);

// Route to get all sessions for a specific counselor
router.get("/counselor/:counselorId", authMiddleware, getCounselorSessions);

// Route to get all sessions for a specific client
router.get("/client/:clientId", authMiddleware, getClientSessions);

// Route for counselor to update session status (Accept/Reject)
router.patch("/:sessionId/status", authMiddleware, updateSessionStatus);

module.exports = router;
