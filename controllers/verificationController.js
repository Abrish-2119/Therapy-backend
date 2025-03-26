// controllers/verificationController.js
const { verifyLicense } = require("../services/licenseVerificationService");
const Counselor = require("../models/counselor");

const verifyCounselorLicense = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) return res.status(404).send("Counselor not found");

    const result = await verifyLicense(counselor.license.number);

    counselor.license.verification = {
      status: result.status,
      verifiedAt: result.status === "verified" ? new Date() : null,
    };
    await counselor.save();

    res.json(counselor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { verifyCounselorLicense };
