// routes/verificationRoutes.js
const express = require("express");
const {
  verifyCounselorLicense,
} = require("../controllers/verificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only route
router.post("/:id/verify", authMiddleware, verifyCounselorLicense);

module.exports = router;
