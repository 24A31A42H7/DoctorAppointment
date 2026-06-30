const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ fullName, email, password: hashed, phone, role: role || "user" });
    await user.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "1d" });

    return res.status(200).json({ success: true, message: "Login successful", token, role: user.role });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get user info
router.get("/getUserData", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Mark all notifications as seen
router.post("/markAllSeen", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.seenNotifications = [...user.seenNotifications, ...user.notifications];
    user.notifications = [];
    await user.save();
    return res.status(200).json({ success: true, message: "Notifications marked as seen", data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete all seen notifications
router.post("/deleteAllSeen", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.notifications = [];
    user.seenNotifications = [];
    await user.save();
    return res.status(200).json({ success: true, message: "Notifications deleted", data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
