const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Setup multer storage
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Book appointment
router.post("/bookAppointment", authMiddleware, upload.single("document"), async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(req.userId);

    const appointment = new Appointment({
      userId: req.userId,
      doctorId,
      doctorInfo: { fullName: doctor.fullName, specialization: doctor.specialization, feesPerConsultation: doctor.feesPerConsultation },
      userInfo: { fullName: user.fullName, phone: user.phone },
      date: new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      document: req.file ? req.file.filename : "",
      status: "pending",
    });

    await appointment.save();

    // Notify doctor user
    const doctorUser = await User.findById(doctor.userId);
    if (doctorUser) {
      doctorUser.notifications.push({
        type: "new-appointment",
        message: `${user.fullName} has booked an appointment`,
        data: { appointmentId: appointment._id, onClickPath: "/doctor/appointments" },
      });
      await doctorUser.save();
    }

    return res.status(201).json({ success: true, message: "Appointment booked successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get user appointments
router.get("/getUserAppointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId });
    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
