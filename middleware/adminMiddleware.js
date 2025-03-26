const adminMiddleware = (req, res, next) => {
  // Ensure `req.user` exists (should be set by `authMiddleware`)
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user data found" });
  }

  // Check if the user has an admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Forbidden: Admins only" });
  }

  next(); // User is admin, proceed to next middleware
};

module.exports = adminMiddleware;
