import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/getUserData');
        if (res.data.success) setUser(res.data.data);
        else { localStorage.removeItem('token'); navigate('/login'); }
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getMenuItems = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [
        { label: 'Users', icon: '📅', path: '/admin/users' },
        { label: 'Doctor', icon: '➕', path: '/admin/doctors' },
        { label: 'Logout', icon: '🚪', action: handleLogout },
      ];
    }
    if (user.role === 'doctor') {
      return [
        { label: 'Appointments', icon: '📅', path: '/doctor/appointments' },
        { label: 'Logout', icon: '🚪', action: handleLogout },
      ];
    }
    return [
      { label: 'Appointments', icon: '📅', path: '/user/appointments' },
      { label: 'Apply doctor', icon: '➕', path: '/user/apply-doctor' },
      { label: 'Logout', icon: '🚪', action: handleLogout },
    ];
  };

  const getSidebarTitle = () => {
    if (!user) return 'MediCareBook';
    if (user.role === 'admin') return 'MediCareBook';
    return 'Book A Doctor';
  };

  const getHeaderName = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Hi..Admin';
    return user.fullName;
  };

  const notifCount = user?.notifications?.length || 0;

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;

  return (
    <div className="layout">
      <div className="layout-body">
        <div className="sidebar">
          <div className="sidebar-logo">{getSidebarTitle()}</div>
          <ul className="sidebar-menu">
            {getMenuItems().map((item, idx) => (
              <li
                key={idx}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => item.action ? item.action() : navigate(item.path)}
              >
                <span>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <div className="content-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
              <div
                className="notification-icon"
                onClick={() => navigate('/notifications')}
                title="Notifications"
              >
                🔔
                {notifCount > 0 && (
                  <span className="notification-badge">{notifCount}</span>
                )}
              </div>
              <span>{getHeaderName()}</span>
            </div>
          </div>
          <div className="content-body">
            {children}
          </div>
          <div className="layout-footer">
            © 2023 Copyright: MediCareBook
          </div>
        </div>
      </div>
    </div>
  );
}
