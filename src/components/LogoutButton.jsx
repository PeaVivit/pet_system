// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // 🔐 ลบ JWT
    navigate('/'); // 🔁 กลับหน้า Login
  };

  return (
    <button onClick={handleLogout} 
    className="logout bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600">
      Logout
    </button>
  );
};

export default LogoutButton;
