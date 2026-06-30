const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    feesPerConsultation: { type: Number, required: true },
    timings: { type: Object, required: true },
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
