const { body, validationResult } = require("express-validator");

const validateSession = [
  // Validate 'counselorId' should be a valid MongoDB ObjectId
  body('counselorId').isMongoId().withMessage("Invalid counselor ID"),

  // Validate 'date' should be a valid ISO 8601 date format
  body('date').isISO8601().toDate().withMessage("Invalid date format"),

  // Validate 'duration' should be an integer between 30 and 120
  body('duration').isInt({ min: 30, max: 120 }).withMessage("Duration must be between 30 and 120 minutes"),

  // Optionally validate 'meetingLink' if provided
  body('meetingLink').optional().isURL().withMessage("Invalid meeting link"),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req); // Get validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return 400 if validation fails
    }
    next(); // Proceed to next middleware if no errors
  }
];

const validateMatchingPreferences = [
  // Validate 'specialties' should be an array and require at least one value
  body("specialties")
    .isArray()
    .withMessage("specialties must be an array")
    .bail() // Prevents further validation if previous validation fails
    .custom((value) => value.length > 0) // Ensure that the array has at least one item
    .withMessage("At least one specialty is required"),

  // Validate 'availability' should be an array (optional)
  body("availability")
    .optional()
    .isArray()
    .withMessage("availability must be an array"),

  // Validate 'languages' should be an array (optional)
  body("languages")
    .optional()
    .isArray()
    .withMessage("languages must be an array"),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req); // Get validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return 400 if validation fails
    }
    next(); // Proceed to next middleware if no errors
  },
];

module.exports = { validateSession, validateMatchingPreferences }; // Export both validation middlewares
