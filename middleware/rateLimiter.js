// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

// General API rate limiter (for all routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated headers
  message: "Too many requests from this IP, please try again later",
});

// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  message: "Too many login attempts, please try again later",
});

module.exports = { apiLimiter, authLimiter };
