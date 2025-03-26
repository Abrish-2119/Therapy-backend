const nodemailer = require("nodemailer");

// Configure transporter (use your email provider settings)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider (e.g., "hotmail", "yahoo", "sendgrid", etc.)
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Use an app password if using Gmail
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "your-email@gmail.com", // Sender address
      to, // Recipient
      subject, // Subject line
      text, // Email body
    });
    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(` Error sending email: ${error.message}`);
  }
};

module.exports = { sendEmail };
