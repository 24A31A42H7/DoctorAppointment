const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorInfo: { type: Object, required: true },
    userInfo: { type: Object, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    document: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
