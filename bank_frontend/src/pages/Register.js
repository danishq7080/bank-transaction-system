import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ MESSAGE STATE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const register = async () => {

    try {

      if (!name || !email || !password) {
        setMessage("Please fill all fields");
        setType("error");
        return;
      }

      await API.post("/create-user", {
        name,
        email,
        password
      });

      // ✅ SUCCESS MESSAGE
      setMessage("User registered successfully");
      setType("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {

      console.error(error);

      // ✅ ERROR MESSAGE
      if (error.response) {
        setMessage(
          error.response.data.detail ||
          JSON.stringify(error.response.data)
        );
      } else {
        setMessage("Registration failed");
      }

      setType("error");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h2 style={{ textAlign: "center" }}>Create Account</h2>

        {/* ✅ MESSAGE UI */}
        {message && (
          <div className={`alert ${type}`}>
            {message}
          </div>
        )}

        <input
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button className="btn-primary" onClick={register}>
          Register
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?
        </p>

        <button
          className="btn-dark"
          onClick={() => navigate("/")}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Register;