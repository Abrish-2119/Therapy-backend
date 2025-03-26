const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a unified User model for client/counselor
const Admin = require("../models/admin"); // For admin model
const Client = require("../models/Client"); // For client model
const Counselor = require("../models/counselor"); // For counselor model

// Sign up for regular user (client or counselor)
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user based on role
    let user;

    if (role === "client") {
      user = new Client({ name, email, password: hashedPassword });
    } else if (role === "counselor") {
      user = new Counselor({ name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin signup logic (Admin is a different model)
const adminSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Admin signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Client signup logic (using Client model)
const clientSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = new Client({ name, email, password: hashedPassword });

    await client.save();

    const token = jwt.sign(
      { id: client._id, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Client signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Counselor signup logic (using Counselor model)
const counselorSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingCounselor = await Counselor.findOne({ email });
    if (existingCounselor) {
      return res.status(400).json({ message: "Counselor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const counselor = new Counselor({ name, email, password: hashedPassword });

    await counselor.save();

    const token = jwt.sign(
      { id: counselor._id, role: "counselor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Counselor signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login logic for all users (admin, client, counselor)
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user =
      (await User.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Client.findOne({ email })) ||
      (await Counselor.findOne({ email }));

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const switchRole = async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res
      .status(400)
      .json({ message: "User ID and new role are required" });
  }

  // Validate new role
  if (!["admin", "client", "counselor"].includes(newRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Find the user in the counselors collection
    const user = await Counselor.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is eligible for role-switching
    if (user.role === "counselor" && newRole === "admin") {
      // Remove the user from the counselors collection
      await Counselor.findByIdAndDelete(userId);

      // Create a new admin entry
      const newAdmin = new Admin({
        name: user.name,
        email: user.email,
        password: user.password, // Keep the same password
        role: "admin",
      });

      await newAdmin.save();

      // Generate new token
      const token = jwt.sign(
        { id: newAdmin._id, role: newAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res
        .status(200)
        .json({ message: "Role switched successfully", token });
    } else {
      return res
        .status(400)
        .json({ message: "Role switch not allowed for this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  signup,
  login,
  adminSignup,
  clientSignup,
  counselorSignup,
  switchRole,
};
