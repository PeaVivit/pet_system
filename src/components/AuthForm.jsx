// components/AuthForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { register, login } from "../api";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
    age: "",
    email: "",
    password: "",
    role: "USER", // default
  });

  // ✅ Redirect หากมี token อยู่แล้ว
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (token && role === "USER") {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  // ✅ Toggle SignIn / SignUp และ clear ฟอร์ม
  const handleToggle = () => {
    setForm({ ...form, email: "", password: "" });
    setIsSignUp(!isSignUp);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Submit form พร้อม loading
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await register(form);
        alert("Register success! Now login.");
        setIsSignUp(false);
      } else {
        const loginPayload = {
          email: form.email,
          password: form.password,
        };
        const res = await login(loginPayload);
        const token = res.data.token;

        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        const role = decoded.role;
        localStorage.setItem("role", role);

        console.log("JWT token from login:", token);
        console.log("Decoded role:", role);

        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }

        alert("Login success!");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Welcome to Pet management system</h2>
      <div
        className={`container ${isSignUp ? "right-panel-active" : ""}`}
        id="container"
      >
        {/* Sign Up */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            <h3>Create Account</h3>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="text" name="nickName" placeholder="Nickname" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Sign In */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleToggle}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleToggle}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>Created with ❤️ by Vivit</p>
      </footer>
    </>
  );
};

export default AuthForm;
