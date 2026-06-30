import { useState } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

export default function ApplyDoctorPage() {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', address: '',
    specialization: '', experience: '', feesPerConsultation: '',
    timings: ['', ''],
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/doctor/applyDoctor', form);
      if (res.data.success) {
        setToast({ message: 'Doctor Registration request sent successfully', type: 'success' });
      } else {
        setToast({ message: res.data.message, type: 'error' });
      }
    } catch (err) {
      console.log(err);
      console.log(form)
      
      setToast({ message: err.response?.data?.message || 'Failed to apply', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="content-title">Apply for Doctor</h2>
      <form className="apply-doctor-form" onSubmit={handleSubmit}>
        <p className="form-section-title">Personal Details:</p>
        <div className="form-row">
          <div className="form-field">
            <label><span>* </span>Full Name:</label>
            <input type="text" placeholder="Full Name" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-field">
            <label><span>* </span>Phone:</label>
            <input type="text" placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-field">
            <label><span>* </span>Email:</label>
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-field">
            <label><span>* </span>Address:</label>
            <input type="text" placeholder="Address" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
        </div>

        <p className="form-section-title">Professional Details:</p>
        <div className="form-row">
          <div className="form-field">
            <label><span>* </span>Specialization:</label>
            <input type="text" placeholder="Specialization" value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
          </div>
          <div className="form-field">
            <label><span>* </span>Experience:</label>
            <input type="number" placeholder="Experience (years)" value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
          </div>
          <div className="form-field">
            <label><span>* </span>Fees:</label>
            <input type="number" placeholder="Consultation Fees" value={form.feesPerConsultation}
              onChange={(e) => setForm({ ...form, feesPerConsultation: e.target.value })} required />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="form-field" style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            <label style={{ marginBottom: 0 }}><span>* </span>Timings:</label>
            <input type="time" value={form.timings[0]}
              onChange={(e) => setForm({ ...form, timings: [e.target.value, form.timings[1]] })}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, width: 130 }}
              required />
            <span>→</span>
            <input type="time" value={form.timings[1]}
              onChange={(e) => setForm({ ...form, timings: [form.timings[0], e.target.value] })}
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, width: 130 }}
              required />
          </div>
        </div>

        <div className="form-submit-row">
          <button type="submit" className="btn-submit-blue" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
