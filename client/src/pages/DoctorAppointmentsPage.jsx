import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get('/doctor/getDoctorAppointments');
      if (res.data.success) setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const res = await axiosInstance.post('/doctor/updateAppointmentStatus', { appointmentId, status });
      if (res.data.success) {
        setToast({ message: 'Successfully updated the appointment status', type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setToast({ message: 'Failed to update', type: 'error' });
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="content-title">All Appointments</h2>
      <div className="appointments-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Appointment</th>
              <th>Phone</th>
              <th>Document</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: '#888' }}>No appointments</td></tr>
            ) : appointments.map((apt) => (
              <tr key={apt._id}>
                <td>{apt.userInfo?.fullName}</td>
                <td>{apt.date}</td>
                <td>{apt.userInfo?.phone}</td>
                <td>
                  {apt.document ? (
                    <a className="doc-link" href={`/uploads/${apt.document}`} target="_blank" rel="noreferrer">
                      {apt.document.substring(0, 24)}
                    </a>
                  ) : 'No document'}
                </td>
                <td><span className={`status-${apt.status}`}>{apt.status}</span></td>
                <td>
                  {apt.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-approve" onClick={() => handleStatusChange(apt._id, 'approved')}>
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleStatusChange(apt._id, 'rejected')}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`status-${apt.status}`}>{apt.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
