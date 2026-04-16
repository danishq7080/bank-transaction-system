import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function CreateAccount() {

  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("");

  // ✅ MESSAGE STATE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const createAccount = async () => {

    if (!accountType) {
      setMessage("Please select an account type");
      setType("error");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in");
        setType("error");

        setTimeout(() => {
          navigate("/");
        }, 1000);

        return;
      }

      const res = await API.post(
        "/create-account",
        {
          account_type: accountType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Save account number
      localStorage.setItem("account_number", res.data.account_number);

      // ✅ SUCCESS MESSAGE
      setMessage(`Account Created! No: ${res.data.account_number}`);
      setType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {

      console.error(error);

      // ✅ ERROR MESSAGE
      if (error.response) {
        setMessage(error.response.data.detail || "Account creation failed");
      } else {
        setMessage("Server not reachable");
      }

      setType("error");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h2 style={{ textAlign: "center" }}>Create Bank Account</h2>

        {/* ✅ MESSAGE UI */}
        {message && (
          <div className={`alert ${type}`}>
            {message}
          </div>
        )}

        <select
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="">Select Account Type</option>
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
          <option value="Business">Business</option>
        </select>

        <button
          className="btn-primary"
          onClick={createAccount}
        >
          Create Account
        </button>

        <button
          className="btn-dark"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

      </div>

    </div>
  );
}

export default CreateAccount;