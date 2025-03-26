// routes/schedulingRoutes.js
const express = require("express");
const {
  bookSession,
  updateSession,
} = require("../controllers/schedulingController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateSession } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/", authMiddleware, validateSession, bookSession);

router.patch("/:id", authMiddleware, validateSession, updateSession);

module.exports = router;
