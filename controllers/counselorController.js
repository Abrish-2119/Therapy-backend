const Counselor = require("../models/counselor");

// Get all counselors
const getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find().select("-password"); // Exclude password field
    res.status(200).json(counselors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single counselor by ID
const getCounselorById = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id).select(
      "-password"
    );
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }
    res.status(200).json(counselor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update counselor profile
const updateCounselorProfile = async (req, res) => {
  try {
    const updatedCounselor = await Counselor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedCounselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    res.status(200).json(updatedCounselor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete counselor account
const deleteCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.findByIdAndDelete(req.params.id);
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }
    res.status(200).json({ message: "Counselor account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify counselor license (Admin Only)
const verifyCounselorLicense = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    // Validate request
    if (!["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    const counselor = await Counselor.findById(req.params.counselorId);
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    // Update verification status
    counselor.license.verification.status = status;
    counselor.license.verification.verifiedAt =
      status === "verified" ? new Date() : null;
    counselor.license.verification.rejectionReason =
      status === "rejected" ? rejectionReason : null;

    await counselor.save();

    res
      .status(200)
      .json({
        message: `License verification updated to ${status}`,
        counselor,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCounselors,
  getCounselorById,
  updateCounselorProfile,
  deleteCounselor,
  verifyCounselorLicense, 
};
