import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW STATE FOR MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success / error

  const handleLogin = async () => {

    try {

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post("/login", formData);

      localStorage.setItem("token", res.data.access_token);

      // ✅ SUCCESS MESSAGE
      setMessage("Login Successful");
      setType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      // ✅ ERROR MESSAGE
      setMessage("Invalid email or password");
      setType("error");

    }

  };

  return (
    <div className="container">

      <div className="card">

        <h2 style={{ textAlign: "center" }}>Login</h2>

        {/* ✅ MESSAGE UI */}
        {message && (
          <div className={`alert ${type}`}>
            {message}
          </div>
        )}

        <input
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?
        </p>

        <button
          className="btn-dark"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>

      </div>

    </div>
  );
}

export default Login;