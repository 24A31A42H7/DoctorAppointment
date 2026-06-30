import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserHomePage from './pages/UserHomePage';
import UserAppointmentsPage from './pages/UserAppointmentsPage';
import ApplyDoctorPage from './pages/ApplyDoctorPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Routes */}
        <Route path="/user/home" element={<ProtectedRoute><UserHomePage /></ProtectedRoute>} />
        <Route path="/user/appointments" element={<ProtectedRoute><UserAppointmentsPage /></ProtectedRoute>} />
        <Route path="/user/apply-doctor" element={<ProtectedRoute><ApplyDoctorPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute><AdminDoctorsPage /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute><AdminAppointmentsPage /></ProtectedRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointmentsPage /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
