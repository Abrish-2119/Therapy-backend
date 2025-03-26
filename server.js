const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from the .env file

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection with options for better compatibility and handling
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Importing routes (ensure these files export `router` correctly)
const authRoutes = require("./routes/authRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const clientRoutes = require("./routes/clientRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const schedulingRoutes = require("./routes/schedulingRoutes");

// Debugging: Check if the imported routes are functions (router export check)
console.log("Auth Routes Type:", typeof authRoutes); // Should log: 'function'
console.log("Counselor Routes Type:", typeof counselorRoutes); // Should log: 'function'
console.log("Client Routes Type:", typeof clientRoutes); // Should log: 'function'
console.log("Session Routes Type:", typeof sessionRoutes); // Should log: 'function'

app.use(apiLimiter);
// Middleware to log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware or route handler
});
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

// Using routes
app.use("/api/auth", authRoutes);
app.use("/api/counselors", counselorRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/matches", matchingRoutes);
app.use("/api/auth", authLimiter);
app.use("/api/sessions", schedulingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
