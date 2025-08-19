// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pet_system';

// ✅ สร้าง instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ เพิ่ม token ในทุก request (interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // JWT ที่เก็บหลัง Login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Export ฟังก์ชัน register และ login แบบเดิม
export const register = async (data) => {
  return axios.post(`${API_URL}/auth/register`, data); // ไม่ต้องใช้ token
};

export const login = async (data) => {
  return axios.post(`${API_URL}/auth/login`, data); // ไม่ต้องใช้ token
};


// ✅ Export instance ที่ใช้ Token ไปใช้ใน component อื่น ๆ
export default api;


