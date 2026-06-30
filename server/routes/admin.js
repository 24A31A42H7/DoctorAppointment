const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

// Get all doctors
router.get("/getAllDoctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    return res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get("/getAllUsers", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all appointments
router.get("/getAllAppointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update doctor status (approve/reject)
router.post("/changeDoctorStatus", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });

    // Notify the doctor's user account
    const doctorUser = await User.findById(doctor.userId);
    if (doctorUser) {
      doctorUser.notifications.push({
        type: "doctor-account-request-updated",
        message: `Your doctor account application has been ${status}`,
        data: { onClickPath: "/notifications" },
      });
      await doctorUser.save();
    }

    return res.status(200).json({ success: true, message: "Successfully updated approve status of the doctor!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
