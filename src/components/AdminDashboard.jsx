// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import LogoutButton from './LogoutButton';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users'); // 🔐 ต้องใช้ JWT
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('แน่ใจว่าต้องการลบผู้ใช้นี้?')) {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    }
  };

  const handleRoleChange = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: editedRole });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ Admin Dashboard</h2>
      <p>This is the Admin Dashboard.</p>
      <LogoutButton />
      {users.map((user) => (
        <div key={user.id} className="border p-4 mb-4 rounded shadow bg-white">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>{user.first_name} {user.last_name}</strong> ({user.email})</p>
              <p>Role: {user.role}</p>
            </div>
            <div className="space-x-2">
              {editingUserId === user.id ? (
                <>
                  <input
                    className="border p-1"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                  />
                  <button onClick={() => handleRoleChange(user.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                    บันทึก
                  </button>
                  <button onClick={() => setEditingUserId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">
                    ยกเลิก
                  </button>
                </>
              ) : (
                <button onClick={() => {
                  setEditedRole(user.role);
                  setEditingUserId(user.id);
                }} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  แก้ไข Role
                </button>
              )}
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                ลบ
              </button>
            </div>
          </div>

          <div className="mt-2 ml-4">
            <h4 className="font-semibold">สัตว์เลี้ยง:</h4>
            {user.pets.length > 0 ? (
              <ul className="list-disc pl-5">
                {user.pets.map((pet) => (
                  <li key={pet.id}>
                    🐾 {pet.name} - {pet.species} ({pet.gender}, {pet.color})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูลสัตว์เลี้ยง</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
