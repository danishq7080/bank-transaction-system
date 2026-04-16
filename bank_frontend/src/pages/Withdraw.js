import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function Withdraw() {

  const navigate = useNavigate();
  const { accountNumber } = useParams();

  const [amount, setAmount] = useState("");

  // ✅ MESSAGE STATE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const withdrawMoney = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!amount || amount <= 0) {
        setMessage("Please enter a valid amount");
        setType("error");
        return;
      }

      await API.post(
        "/withdraw",
        {
          account_number: accountNumber,
          amount: Number(amount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ SUCCESS MESSAGE
      setMessage("Withdraw Successful");
      setType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      console.error(error);

      // ✅ ERROR MESSAGE
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Withdraw failed");
      }

      setType("error");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h2 style={{ textAlign: "center" }}>Withdraw Money</h2>

        {/* ✅ MESSAGE UI */}
        {message && (
          <div className={`alert ${type}`}>
            {message}
          </div>
        )}

        <p style={{ textAlign: "center", color: "#555" }}>
          Account: <b>{accountNumber}</b>
        </p>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="btn-warning" onClick={withdrawMoney}>
          Withdraw
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

export default Withdraw;