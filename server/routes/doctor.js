const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

// Apply for doctor
router.post("/applyDoctor", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending", userId: req.userId });
    console.log(newDoctor)
    await newDoctor.save();

    // Notify admin
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      adminUser.notifications.push({
        type: "apply-doctor-request",
        message: `${newDoctor.fullName} has applied for a doctor account`,
        data: { doctorId: newDoctor._id, name: newDoctor.fullName, onClickPath: "/admin/doctors" },
      });
      console.log(adminUser)
      await adminUser.save();
    }

    return res.status(201).json({ success: true, message: "Doctor registration request sent successfully" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all approved doctors (for users)
router.get("/getAllDoctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    return res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get doctor info by userId
router.get("/getDoctorInfo/:userId", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    return res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get doctor appointments
router.get("/getDoctorAppointments", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id });
    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update appointment status (doctor)
router.post("/updateAppointmentStatus", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

    // Notify user
    const user = await User.findById(appointment.userId);
    user.notifications.push({
      type: "appointment-status-update",
      message: `Your appointment with Dr. ${appointment.doctorInfo.fullName} has been ${status}`,
      data: { appointmentId, status, onClickPath: "/appointments" },
    });
    await user.save();

    return res.status(200).json({ success: true, message: "Appointment status updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
