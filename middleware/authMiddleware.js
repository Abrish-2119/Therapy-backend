const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Debugging line: Print the Authorization header to check its content
  console.log("Authorization header:", authHeader);

  // Check if the authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  // Debugging line: Print the token to check if it's correctly extracted
  console.log("Token received:", token);

  try {
    // Verify the token using the secret key stored in the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging line: Print the decoded token data (user information)
    console.log("Decoded token:", decoded);

    // Attach the decoded token data (user info) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Debugging line: Print the error message if token verification fails
    console.log("Token verification failed:", error.message);

    return res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
