import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';
import Toast from '../components/Toast';

function BookingModal({ doctor, onClose, onBook }) {
  const [date, setDate] = useState('');
  const [document, setDocument] = useState(null);

  const handleSubmit = () => {
    if (!date) return alert('Please select date and time');
    onBook({ date, document });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">Booking appointment</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div>
          <p><strong>Doctor Details:</strong></p>
          <p>Name: &nbsp;<strong>{doctor.fullName}</strong></p>
          <hr className="modal-divider" />
          <p>Specialization: &nbsp;<strong>{doctor.specialization}</strong></p>
          <hr className="modal-divider" />
        </div>
        <div className="modal-field">
          <label>Appointment Date and Time:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Documents</label>
          <input type="file" onChange={(e) => setDocument(e.target.files[0])} />
        </div>
        <div className="modal-footer">
          <button className="btn-close-gray" onClick={onClose}>Close</button>
          <button className="btn-book-blue" onClick={handleSubmit}>Book</button>
        </div>
      </div>
    </div>
  );
}

export default function UserHomePage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get('/doctor/getAllDoctors');
        if (res.data.success) setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async ({ date, document: doc }) => {
    try {
      const formData = new FormData();
      formData.append('doctorId', selectedDoctor._id);
      formData.append('date', date);
      if (doc) formData.append('document', doc);

      const res = await axiosInstance.post('/appointment/bookAppointment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setToast({ message: 'Appointment booked successfully', type: 'success' });
        setSelectedDoctor(null);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to book', type: 'error' });
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onBook={handleBook}
        />
      )}
      <h2 className="content-title">Home</h2>
      {doctors.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No approved doctors available.</p>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <h3>Dr. {doc.fullName}</h3>
              <p>Phone: <span>{doc.phone}</span></p>
              <p>Address: <span>{doc.address}</span></p>
              <p className="specialization-text">Specialization: <strong>{doc.specialization}</strong></p>
              <p>Experience: <span>{doc.experience} Yrs</span></p>
              <p>Fees: <span>{doc.feesPerConsultation}</span></p>
              <p className="timing-text">
                Timing: <span>
                  {doc.timings?.[0] || ''} : {doc.timings?.[1] || ''}
                </span>
              </p>
              <button className="btn-book-now" onClick={() => setSelectedDoctor(doc)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
