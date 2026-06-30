import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axiosConfig';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/admin/getAllUsers');
        if (res.data.success) setUsers(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <h2 className="content-title">All Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td style={{ color: '#2563eb' }}>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
