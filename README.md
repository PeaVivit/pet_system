# 🐾 Pet System

A **Pet Management System** built with **Spring Boot (Backend)** and **React (Frontend)**.  
It supports **JWT Authentication**, **Role-based Access Control (Admin/User)**, and full **Pet Management (with image upload)**.  

---

## 📌 Features

### 🔐 Authentication
- Register / Login with Email + Password
- JWT Token-based Authentication
- Role-based Authorization (Admin, User)

### 👤 User Dashboard
- Manage own profile (view & update)
- Add pets (with image upload)
- View list of pets owned by the user

### 🛠️ Admin Dashboard
- View all users
- Edit / Delete user accounts
- Manage user roles (Admin/User)
- View pets associated with each user

### 🐶 Pet Management
- Add / Edit / Delete pets
- Display pets per user

---

## 🏗️ Tech Stack

### Backend (Spring Boot 3.5.3)
- Spring Boot (REST API)
- Spring Security + JWT
- JPA + Hibernate
- PostgreSQL
- Lombok

### Frontend (React + Vite)
- React.js
- Axios
- Tailwind CSS
- JWT Authentication (localStorage)

---

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/pet_system.git
cd pet_system


 Backend Setup
cd backend
./mvnw spring-boot:run


Configure your PostgreSQL database in application.properties

Default API runs at: http://localhost:8080/api

3. Frontend Setup
cd frontend
npm install
npm run dev


Runs on: http://localhost:5173

📂 Project Structure
pet_system/
│── backend/         # Spring Boot API
│   ├── config/      # Security & JWT config
│   ├── controllers/ # REST controllers
│   ├── dto/         # Data Transfer Objects
│   ├── models/      # Entities (AppUser, Pets)
│   ├── repositories/# Spring Data JPA
│   └── services/    # Business logic
│
│── frontend/        # React + Vite app
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # User & Admin dashboards
│   │   ├── api.js      # Axios instance
│   │   └── App.js      # Root component
│
└── README.md

🚀 Usage

- Register as a new user and log in

- Add pets (with optional images)

- Manage pets via User Dashboard

- Admin can manage users & roles via Admin Dashboard

🔒 Authentication Flow

- User registers or logs in

- Backend issues a JWT token

- Token is stored in localStorage

- Axios attaches token in Authorization: Bearer <token>

- Backend verifies token for every protected route

