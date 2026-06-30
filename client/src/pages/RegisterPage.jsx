import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'user' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', form);
      if (res.data.success) {
        setToast({ message: 'Registration successful! Please login.', type: 'success' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setToast({ message: res.data.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <nav className="auth-navbar">
        <span className="auth-logo">MediCareBook</span>
        <Link to="/" className="auth-nav-link">Home</Link>
        <Link to="/login" className="auth-nav-link">Login</Link>
        <Link to="/register" className="auth-nav-link">Register</Link>
      </nav>

      <div className="auth-container">
        <div className="auth-form-section" style={{ width: '50%' }}>
          <h2>Sign up to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="John"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="j@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <div className="radio-group">
                <label>
                  <input type="radio" name="role" value="admin" checked={form.role === 'admin'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  Admin
                </label>
                <label>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  User
                </label>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="auth-link" onClick={() => navigate('/login')}>
            Have an account? Login here
          </p>
        </div>

        <div className="auth-image" style={{ width: '45%' }}>
          <img
            src="https://img.freepik.com/free-vector/doctor-patient-discussion-medical-appointment_74855-7482.jpg?w=740"
            alt="Register"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="width:400px;height:380px;background:linear-gradient(135deg,#3498db,#2980b9);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:6rem;">👨‍⚕️</div>`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
