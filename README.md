# MediCareBook - Doctor Appointment Booking System

A full-stack MERN application for booking doctor appointments.

## Project Structure

```
doctorAppointment/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Layout, Toast, ProtectedRoute
│       ├── pages/        # All page components
│       └── utils/        # Axios config
└── server/          # Express + MongoDB backend
    ├── models/       # User, Doctor, Appointment schemas
    ├── routes/       # auth, doctor, appointment, admin
    └── middleware/   # JWT auth middleware
```

## Features

- **Public**: Landing page, Login, Register (Admin/User roles)
- **User**: Browse approved doctors, book appointments (with optional document upload), view appointments, apply to become a doctor, notifications
- **Doctor**: View & manage patient appointments (approve/reject), notifications
- **Admin**: Manage all users, approve/reject doctor applications, view all appointments

## Setup Instructions

### 1. MongoDB
Make sure MongoDB is running locally on port 27017, or update the `MONGO_URI` in `server/.env`.

### 2. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```
Server runs on http://localhost:5000

### 3. Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs on http://localhost:3000

### 4. Run Both Together (from root)
```bash
npm install          # installs concurrently
npm run dev          # starts both server and client
```

## Environment Variables (server/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctorAppointment
JWT_SECRET=your_secret_key
```

## Create First Admin User

Register at `/register` and select "Admin" role.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/getUserData | Get current user |
| POST | /api/doctor/applyDoctor | Apply to be a doctor |
| GET | /api/doctor/getAllDoctors | Get approved doctors |
| GET | /api/doctor/getDoctorAppointments | Doctor's appointments |
| POST | /api/doctor/updateAppointmentStatus | Update appointment |
| POST | /api/appointment/bookAppointment | Book an appointment |
| GET | /api/appointment/getUserAppointments | User's appointments |
| GET | /api/admin/getAllUsers | All users (admin) |
| GET | /api/admin/getAllDoctors | All doctors (admin) |
| GET | /api/admin/getAllAppointments | All appointments (admin) |
| POST | /api/admin/changeDoctorStatus | Approve/reject doctor |
