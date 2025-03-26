const express = require("express");
const {
  verifyCounselorLicense,
} = require("../controllers/counselorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all counselors
router.get("/", (req, res) => {
  res.status(200).json({ message: "List of counselors" });
});

// Add a new counselor
router.post("/", (req, res) => {
  const { name, specialization } = req.body;
  res
    .status(201)
    .json({ message: "Counselor added", data: { name, specialization } });
});

// Verify a counselor's license (Admin Only)
router.patch("/:counselorId/verify", authMiddleware, verifyCounselorLicense);

module.exports = router;
