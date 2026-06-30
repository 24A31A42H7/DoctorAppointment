const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctor");
const appointmentRoutes = require("./routes/appointment");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("MediCareBook API Running"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/doctorAppointment";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
