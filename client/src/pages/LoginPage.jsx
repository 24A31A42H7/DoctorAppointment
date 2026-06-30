import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', form);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(() => {
          const role = res.data.role;
          if (role === 'admin') navigate('/admin/users');
          else navigate('/user/home');
        }, 1000);
      } else {
        setToast({ message: res.data.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
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
        <div className="auth-image">
          <img
            src="https://img.freepik.com/free-vector/telemedicine-abstract-concept-illustration_335657-3834.jpg?w=740"
            alt="Doctor"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="width:400px;height:350px;background:linear-gradient(135deg,#1abc9c,#16a085);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:6rem;">🏥</div>`;
            }}
          />
        </div>

        <div className="auth-form-section">
          <h2>Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : "Let's Enter"}
            </button>
          </form>
          <p className="auth-link" onClick={() => navigate('/register')}>
            Don't have an account? Register here
          </p>
        </div>
      </div>
    </div>
  );
}
