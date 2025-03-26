const Session = require("../models/session");
const Counselor = require("../models/counselor");
const Client = require("../models/client");

/**
 * @desc Create a new session (Booking)
 * @route POST /api/sessions/book
 * @access Private (Client only)
 */
exports.createSession = async (req, res) => {
  try {
    const { counselorId, clientId, sessionType, date, duration } = req.body;

    const counselor = await Counselor.findById(counselorId);
    const client = await Client.findById(clientId);

    if (!counselor || !client) {
      return res.status(404).json({ message: "Counselor or Client not found" });
    }

    // Check if a session already exists at the given time
    const existingSession = await Session.findOne({ counselorId, date });
    if (existingSession) {
      return res
        .status(400)
        .json({ message: "Counselor is already booked at this time." });
    }

    // Create the new session
    const newSession = new Session({
      counselorId,
      clientId,
      sessionType,
      date,
      duration,
      status: "pending", // Default status
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate(
      "counselorId clientId",
      "name email"
    );
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "counselorId clientId",
      "name email"
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("counselorId clientId", "name email");
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCounselorSessions = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const sessions = await Session.find({ counselorId }).populate(
      "clientId",
      "name email"
    );
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getClientSessions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const sessions = await Session.find({ clientId }).populate(
      "counselorId",
      "name email"
    );
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Counselor updates session status (Accept/Reject)
 * @route PATCH /api/sessions/:sessionId/status
 * @access Private (Counselor only)
 */
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found." });
    }

    res
      .status(200)
      .json({ message: `Session ${status}`, session: updatedSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
