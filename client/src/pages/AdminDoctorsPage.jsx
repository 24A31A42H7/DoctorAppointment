import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/admin/getAllDoctors');
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleStatusChange = async (doctorId, status) => {
    try {
      const res = await axiosInstance.post('/admin/changeDoctorStatus', { doctorId, status });
      if (res.data.success) {
        setToast({ message: 'Successfully updated approve status of the doctor!', type: 'success' });
        fetchDoctors();
      }
    } catch (err) {
      setToast({ message: 'Action failed', type: 'error' });
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="content-title">All Doctors</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id}>
              <td style={{ fontSize: '0.8rem', color: '#888' }}>{doc._id}</td>
              <td style={{ color: '#d97706', fontWeight: 600 }}>{doc.fullName}</td>
              <td style={{ color: '#2563eb' }}>{doc.email}</td>
              <td>{doc.phone}</td>
              <td>
                {doc.status === 'approved' ? (
                  <button className="btn-reject" onClick={() => handleStatusChange(doc._id, 'rejected')}>
                    Reject
                  </button>
                ) : (
                  <button className="btn-approve" onClick={() => handleStatusChange(doc._id, 'approved')}>
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
