import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';

export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/appointment/getUserAppointments');
        if (res.data.success) setAppointments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <h2 className="content-title">My Appointments</h2>
      <div className="appointments-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Document</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: 30 }}>No appointments found</td></tr>
            ) : appointments.map((apt) => (
              <tr key={apt._id}>
                <td>Dr. {apt.doctorInfo?.fullName}</td>
                <td>{apt.date}</td>
                <td>
                  {apt.document ? (
                    <a
                      className="doc-link"
                      href={`/uploads/${apt.document}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {apt.document.substring(0, 24)}...
                    </a>
                  ) : 'No document'}
                </td>
                <td>
                  <span className={`status-${apt.status}`}>{apt.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
