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
    role: "USER",
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Toggle SignIn / SignUp
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  // ✅ Submit
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

        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (err) {
      alert("Error: " + (err.response?.data || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="nickName"
                  placeholder="Nickname"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              onChange={handleChange}
              required
            />

            {/* Remember + Toggle */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </button>

            {/* Toggle */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {isSignUp ? "Already have an account?" : "Don’t have an account yet?"}{" "}
              <button
                type="button"
                onClick={handleToggle}
                className="font-medium text-blue-600 hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;

