import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/admin/getAllAppointments');
        if (res.data.success) setAppointments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <h2 className="content-title">All Appointments for Admin Panel</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>User Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#888' }}>No appointments</td></tr>
          ) : appointments.map((apt) => (
            <tr key={apt._id}>
              <td style={{ fontSize: '0.8rem', color: '#888' }}>{apt._id}</td>
              <td style={{ color: '#2563eb' }}>{apt.userInfo?.fullName}</td>
              <td style={{ color: '#2563eb' }}>{apt.doctorInfo?.fullName}</td>
              <td>{apt.date}</td>
              <td><span className={`status-${apt.status}`}>{apt.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
