const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model

// Sign up a counselor
const signupCounselor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the counselor already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Counselor already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new counselor (you should have a separate model/schema for counselors if needed)
    const newCounselor = new User({
      name,
      email,
      password: hashedPassword,
      role: "counselor", // Example field to differentiate counselor
    });

    await newCounselor.save();
    res.status(201).json({ message: "Counselor signed up successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sign up a client
const signupClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the client already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Client already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new client (similar to counselor, this can be differentiated based on role)
    const newClient = new User({
      name,
      email,
      password: hashedPassword,
      role: "client", // Example field to differentiate client
    });

    await newClient.save();
    res.status(201).json({ message: "Client signed up successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login route for both counselors and clients
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signupCounselor,
  signupClient,
  login,
};
