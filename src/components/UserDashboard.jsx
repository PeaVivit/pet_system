// src/components/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import LogoutButton from './LogoutButton';
import { jwtDecode } from 'jwt-decode'; 


const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    console.log('Token Payload:', decoded); // 🔎 ดูว่ามี field อะไรบ้าง
    const id = decoded.id || decoded.sub_id || decoded.userId;

    if (!id) {
      console.error("❌ ไม่พบ ID ใน token:", decoded);
      return;
    }

    setUserId(id);

    const res = await api.get(`/pet_system/app_user/${id}`);
    setUser(res.data);
    setFormData(res.data);
  } catch (error) {
    console.error('🚫 Error fetching user:', error);
  }
};



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/pet_system/app_user/${userId}`, formData);
      setEditMode(false);
      fetchCurrentUser();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('แน่ใจว่าต้องการลบบัญชีผู้ใช้นี้?')) {
      try {
        await api.delete(`/pet_system/app_user/${userId}`);
        alert('บัญชีผู้ใช้ถูกลบแล้ว');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 User Dashboard</h2>
      <LogoutButton />

      {editMode ? (
        <>
          <div className="space-y-2">
            <input name="first_name" value={formData.first_name} onChange={handleChange} className="border p-2 w-full" placeholder="ชื่อจริง" />
            <input name="last_name" value={formData.last_name} onChange={handleChange} className="border p-2 w-full" placeholder="นามสกุล" />
            <input name="nick_name" value={formData.nick_name} onChange={handleChange} className="border p-2 w-full" placeholder="ชื่อเล่น" />
            <input name="age" type="number" value={formData.age} onChange={handleChange} className="border p-2 w-full" placeholder="อายุ" />
            <input name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full" placeholder="สถานะ" />
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">💾 บันทึก</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded">ยกเลิก</button>
          </div>
        </>
      ) : (
        <div className="bg-white border rounded p-4 shadow">
          <p><strong>ชื่อ:</strong> {user.first_name} {user.last_name} ({user.nick_name})</p>
          <p><strong>อายุ:</strong> {user.age}</p>
          <p><strong>อีเมล:</strong> {user.email}</p>
          <p><strong>สถานะ:</strong> {user.status}</p>

          <div className="mt-4 space-x-2">
            <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">✏️ แก้ไข</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">🗑️ ลบบัญชี</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
