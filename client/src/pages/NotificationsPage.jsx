import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('unread');

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get('/auth/getUserData');
      if (res.data.success) setUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const markAllSeen = async () => {
    try {
      await axiosInstance.post('/auth/markAllSeen');
      fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    try {
      await axiosInstance.post('/auth/deleteAllSeen');
      fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

  const notifications = tab === 'unread' ? (user?.notifications || []) : (user?.seenNotifications || []);

  return (
    <Layout>
      <h2 className="content-title">Notifications</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setTab('unread')}
          style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #d1d5db', background: tab === 'unread' ? '#2563eb' : '#fff', color: tab === 'unread' ? '#fff' : '#333', cursor: 'pointer', fontWeight: 600 }}
        >
          Unread ({user?.notifications?.length || 0})
        </button>
        <button
          onClick={() => setTab('read')}
          style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #d1d5db', background: tab === 'read' ? '#2563eb' : '#fff', color: tab === 'read' ? '#fff' : '#333', cursor: 'pointer', fontWeight: 600 }}
        >
          Read ({user?.seenNotifications?.length || 0})
        </button>
        {tab === 'unread' && (user?.notifications?.length || 0) > 0 && (
          <button onClick={markAllSeen} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #16a34a', color: '#16a34a', background: '#fff', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}>
            Mark All Read
          </button>
        )}
        {tab === 'read' && (user?.seenNotifications?.length || 0) > 0 && (
          <button onClick={deleteAll} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #dc2626', color: '#dc2626', background: '#fff', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}>
            Delete All
          </button>
        )}
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>No notifications</div>
        ) : notifications.map((n, idx) => (
          <div className="notification-item" key={idx}>
            <span className="notification-message">{n.message}</span>
            <span className="notification-time">{n.type}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}
