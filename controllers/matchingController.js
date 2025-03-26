const {
  matchAndSave,
  matchCounselors,
} = require("../services/matchingService");
const Matching = require("../models/matching");

// ✅ Get Matches (Real-time & Save to DB)
const getMatches = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found" });
    }

    const clientId = req.user.id; // Extract client ID from auth middleware
    const preferences = req.body; // Client's preferences

    console.log("Client ID:", clientId);
    console.log("Matching Preferences:", preferences);

    // Real-time matching
    const matches = await matchCounselors(preferences);

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "No matching counselors found." });
    }

    // Save matches to DB
    await matchAndSave(clientId, preferences);

    res.json(matches);
  } catch (err) {
    console.error("Error in getMatches:", err);
    res.status(500).json({ error: "Server error while fetching matches." });
  }
};

// ✅ Get Match History
const getMatchHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found" });
    }

    const history = await Matching.find({ clientId: req.user.id })
      .sort({ matchedOn: -1 })
      .populate("counselorId", "name specialties");

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No match history found." });
    }

    res.json(history);
  } catch (err) {
    console.error("Error in getMatchHistory:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching match history." });
  }
};

module.exports = { getMatches, getMatchHistory };
