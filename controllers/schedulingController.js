const Session = require("../models/session");
const { sendEmail } = require("../services/emailService"); // Import email service

const bookSession = async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      clientId: req.user.id,
      status: "pending",
    });

    await session.save();

    // Send email notifications (to both client & counselor)
    await sendBookingConfirmation(session);

    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({
      error: err.message,
      type: err.name === "ValidationError" ? "validation" : "general",
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!session) return res.status(404).json({ error: "Session not found" });

    // Send update notification email
    await sendEmail(
      session.clientEmail,
      "Session Updated",
      "Your session details have been updated."
    );

    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Helper function to send booking confirmation emails
const sendBookingConfirmation = async (session) => {
  const mailOptions = {
    to: [session.clientEmail, session.counselorEmail],
    subject: "New Counseling Session Booked",
    html: `<p>Your session is scheduled for ${session.date}.</p>`,
  };
  await sendEmail(mailOptions);
};

module.exports = { bookSession, updateSession };
